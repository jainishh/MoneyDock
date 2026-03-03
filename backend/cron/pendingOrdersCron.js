import cron from 'node-cron';
import Order from '../models/Order.js';
import User from '../models/User.js';
import restAPI from '../services/angelOneRestAPI.js';
import { createLogger } from '../utils/logger.js';
import { isMarketOpen } from '../utils/marketHours.js';

const logger = createLogger('PendingOrdersCron');

/**
 * Executes a single pending order if price conditions are met
 */
const executeOrder = async (order, currentPrice) => {
    try {
        const user = await User.findById(order.userId);
        if (!user) {
            logger.warn(`User ${order.userId} not found for pending order ${order._id}`);
            return false;
        }

        // --- BUY ORDER EXECUTION ---
        if (order.transactiontype === 'BUY') {
            const cost = currentPrice * order.quantity;

            // Re-verify balance at execution time
            if (user.tradingBalance < cost) {
                logger.warn(`Insufficient balance to auto-execute BUY order ${order._id}. Cost: ${cost}, Balance: ${user.tradingBalance}`);
                // Optional: We could mark it as rejected here, but for now we'll just skip and it remains pending.
                // Or maybe we should reject it to prevent infinite retries. Let's reject it to be safe.
                order.orderstatus = 'rejected';
                order.message = `Auto-execute failed: Insufficient balance. Need ${cost}, have ${user.tradingBalance}`;
                await order.save();
                return false;
            }

            // Deduct balance
            user.tradingBalance -= cost;
            await user.save();

            // Update order
            order.orderstatus = 'complete';
            order.averagePrice = currentPrice;
            order.filledShares = order.quantity;
            order.unfilledShares = 0;
            order.message = `Auto-Executed at ${currentPrice}`;
            await order.save();

            logger.success(`Auto-executed pending BUY order ${order._id} for ${order.tradingsymbol} at ${currentPrice}`);
            return true;
        }

        // --- SELL ORDER EXECUTION ---
        if (order.transactiontype === 'SELL') {
            // For equity, we've already bypassed pending checks. But if they somehow don't have holdings now?
            // Actually, holdings are just based on completed orders. At the time of placing pending, we verified. 
            // If they sold it another way, they might not have it. Let's assume they have it for now to keep it simple, 
            // since we don't have a strict "lock" on holdings.

            const revenue = currentPrice * order.quantity;

            // Add revenue to balance
            user.tradingBalance += revenue;
            await user.save();

            // Update order
            order.orderstatus = 'complete';
            order.averagePrice = currentPrice;
            order.filledShares = order.quantity;
            order.unfilledShares = 0;
            order.message = `Auto-Executed at ${currentPrice}`;
            await order.save();

            logger.success(`Auto-executed pending SELL order ${order._id} for ${order.tradingsymbol} at ${currentPrice}`);
            return true;
        }

    } catch (error) {
        logger.error(`Error executing pending order ${order._id}:`, error);
        return false;
    }
};

/**
 * Main routine to check and execute pending orders
 */
const checkAndExecutePendingOrders = async () => {
    try {
        // Optional: uncomment if you only want this to run during market hours
        // if (!isMarketOpen()) {
        //     return;
        // }

        if (!restAPI.isInitialized) {
            logger.debug('Skipping pending order check: Angel One REST API not initialized yet.');
            return;
        }

        // 1. Fetch all pending limit orders
        const pendingOrders = await Order.find({ orderstatus: 'pending' });

        if (pendingOrders.length === 0) {
            return; // Nothing to do
        }

        // 2. Extract unique exchange & token combinations
        const uniqueTokensMap = new Map();

        pendingOrders.forEach(order => {
            const key = `${order.exchange}_${order.symboltoken}`;
            if (!uniqueTokensMap.has(key)) {
                uniqueTokensMap.set(key, {
                    token: order.symboltoken,
                    exch_seg: order.exchange
                });
            }
        });

        const stocksToFetch = Array.from(uniqueTokensMap.values());

        // 3. Fetch latest quotes
        let quotes = [];
        try {
            quotes = await restAPI.getQuotes(stocksToFetch);
        } catch (fetchErr) {
            logger.error('Failed to fetch quotes for pending orders:', fetchErr.message);
            return;
        }

        if (!quotes || quotes.length === 0) return;

        // Convert quotes array to a quick lookup map key: exch_token
        const quoteMap = {};
        quotes.forEach(q => {
            quoteMap[`${q.exch_seg}_${q.token}`] = q.ltp;
        });

        // 4. Evaluate each order
        for (const order of pendingOrders) {
            const key = `${order.exchange}_${order.symboltoken}`;
            const currentPrice = quoteMap[key];

            if (!currentPrice) continue; // Quote not found for this token

            const isStopLoss = order.ordertype === 'STOPLOSS_MARKET' || order.ordertype === 'STOPLOSS_LIMIT';
            
            // Limit Order Logic
            if (!isStopLoss) {
                // BUY: Execute if current price is LESS THAN OR EQUAL to limit price
                if (order.transactiontype === 'BUY' && currentPrice <= order.price) {
                    await executeOrder(order, currentPrice);
                }
                // SELL: Execute if current price is GREATER THAN OR EQUAL to limit price
                else if (order.transactiontype === 'SELL' && currentPrice >= order.price) {
                    await executeOrder(order, currentPrice);
                }
            } 
            // Stop Loss Logic (Real stock market logic)
            else {
                // Determine the trigger threshold
                const trigger = order.triggerprice || order.stoploss || order.price;

                // BUY (Covering a Short): Execute if current price RISES to or ABOVE trigger price
                if (order.transactiontype === 'BUY' && currentPrice >= trigger) {
                    await executeOrder(order, currentPrice);
                }
                // SELL (Exiting a Long): Execute if current price FALLS to or BELOW trigger price
                else if (order.transactiontype === 'SELL' && currentPrice <= trigger) {
                    await executeOrder(order, currentPrice);
                }
            }
        }

    } catch (error) {
        logger.error('Critical Error in Pending Orders Cron:', error);
    }
};

/**
 * Initialize the cron job
 */
const startPendingOrdersCron = () => {
    // Run every 10 seconds
    cron.schedule('*/10 * * * * *', () => {
        checkAndExecutePendingOrders();
    });

    logger.info('Scheduled Pending Orders Execution Cron (every 10s)');
};

export default startPendingOrdersCron;
