import cron from 'node-cron';
import Order from '../models/Order.js';
import User from '../models/User.js';
import restAPI from '../services/angelOneRestAPI.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('AutoSquareOff');

/**
 * Derive open INTRADAY positions for a given user
 * Returns array of { tradingsymbol, symboltoken, exchange, producttype, netQty, avgBuyPrice }
 */
const getOpenIntradayPositions = (completedOrders) => {
    const positionMap = {};

    for (const order of completedOrders) {
        // Only process INTRADAY product type orders
        if (order.producttype !== 'INTRADAY') continue;

        const key = order.tradingsymbol;

        if (!positionMap[key]) {
            positionMap[key] = {
                tradingsymbol: order.tradingsymbol,
                symboltoken: order.symboltoken,
                exchange: order.exchange,
                producttype: order.producttype,
                buyQty: 0,
                sellQty: 0,
                buyValue: 0,
            };
        }

        const pos = positionMap[key];
        const qty = order.filledShares || order.quantity;
        const avgPrice = order.averagePrice || order.price || 0;

        if (order.transactiontype === 'BUY') {
            pos.buyQty += qty;
            pos.buyValue += qty * avgPrice;
        } else {
            pos.sellQty += qty;
        }
    }

    // Filter only positions that are still open (netQty > 0)
    return Object.values(positionMap)
        .map(pos => ({
            ...pos,
            netQty: pos.buyQty - pos.sellQty,
            avgBuyPrice: pos.buyQty > 0 ? pos.buyValue / pos.buyQty : 0,
        }))
        .filter(pos => pos.netQty > 0);
};

/**
 * Square off a single intraday position for a user
 */
const squareOffPosition = async (user, position, currentPrice) => {
    try {
        const sellPrice = currentPrice || position.avgBuyPrice;
        const revenue = sellPrice * position.netQty;

        // Create auto square-off SELL order
        const squareOffOrder = new Order({
            userId: user._id,
            variety: 'NORMAL',
            tradingsymbol: position.tradingsymbol,
            symboltoken: position.symboltoken,
            transactiontype: 'SELL',
            exchange: position.exchange,
            ordertype: 'MARKET',
            producttype: 'INTRADAY',
            price: 0,
            marketPriceAtOrder: sellPrice,
            quantity: position.netQty,
            filledShares: position.netQty,
            unfilledShares: 0,
            averagePrice: sellPrice,
            orderstatus: 'complete',
            angelOrderId: 'AUTO-SQ-' + Date.now(),
            uniqueorderid: 'ASQ-UID-' + Date.now(),
            message: `Auto Square-Off at ${sellPrice} (3:15 PM auto-exit)`,
            tag: 'AUTO_SQUAREOFF',
        });

        await squareOffOrder.save();

        // Credit the sell revenue to user's trading balance
        user.tradingBalance += revenue;

        logger.success(
            `Auto squared off ${position.netQty} qty of ${position.tradingsymbol} ` +
            `(${position.exchange}) for user ${user._id} at ₹${sellPrice}. Revenue: ₹${revenue.toFixed(2)}`
        );

        return { success: true, revenue };
    } catch (error) {
        logger.error(
            `Failed to square off ${position.tradingsymbol} for user ${user._id}:`,
            error.message
        );
        return { success: false, revenue: 0 };
    }
};

/**
 * Main auto square-off routine
 * Runs at 3:15 PM IST — squares off all open INTRADAY positions before market close
 */
const runAutoSquareOff = async () => {
    logger.info('🔔 Auto Square-Off triggered (3:15 PM IST) — squaring off all INTRADAY positions...');

    try {
        // Fetch all users who have completed INTRADAY BUY orders
        const intradayBuyOrders = await Order.find({
            orderstatus: 'complete',
            transactiontype: 'BUY',
            producttype: 'INTRADAY',
        }).distinct('userId');

        if (intradayBuyOrders.length === 0) {
            logger.info('Auto Square-Off: No INTRADAY positions found. Nothing to do.');
            return;
        }

        logger.info(`Auto Square-Off: Found ${intradayBuyOrders.length} user(s) with INTRADAY activity.`);

        // Build a list of unique tokens to fetch quotes for
        const uniqueTokensMap = new Map();

        // Process each user
        for (const userId of intradayBuyOrders) {
            const user = await User.findById(userId);
            if (!user) continue;

            // Get all completed orders for this user
            const completedOrders = await Order.find({
                userId,
                orderstatus: 'complete',
                producttype: 'INTRADAY',
            });

            const openPositions = getOpenIntradayPositions(completedOrders);

            if (openPositions.length === 0) {
                logger.debug(`User ${userId}: No open INTRADAY positions. Skipping.`);
                continue;
            }

            logger.info(`User ${userId}: ${openPositions.length} open INTRADAY position(s) to square off.`);

            // Collect tokens for quote fetch
            openPositions.forEach(pos => {
                const key = `${pos.exchange}_${pos.symboltoken}`;
                if (!uniqueTokensMap.has(key)) {
                    uniqueTokensMap.set(key, { token: pos.symboltoken, exch_seg: pos.exchange });
                }
            });

            // Try to get live prices, fall back to avg buy price
            let quoteMap = {};

            if (restAPI.isInitialized && uniqueTokensMap.size > 0) {
                try {
                    const stocksToFetch = Array.from(uniqueTokensMap.values());
                    const quotes = await restAPI.getQuotes(stocksToFetch);

                    if (quotes && quotes.length > 0) {
                        quotes.forEach(q => {
                            quoteMap[`${q.exch_seg}_${q.token}`] = q.ltp;
                        });
                    }
                } catch (quoteErr) {
                    logger.warn('Could not fetch live quotes for auto square-off. Using avg buy price as fallback:', quoteErr.message);
                }
            } else {
                logger.warn('Angel One REST API not initialized. Falling back to avg buy price for square-off pricing.');
            }

            // Square off each open position
            let totalRevenue = 0;

            for (const position of openPositions) {
                const key = `${position.exchange}_${position.symboltoken}`;
                const livePrice = quoteMap[key] || position.avgBuyPrice; // fallback to avg buy price

                const result = await squareOffPosition(user, position, livePrice);
                if (result.success) {
                    totalRevenue += result.revenue;
                }
            }

            // Save user with updated balance (accumulated from all positions)
            await user.save();

            logger.success(
                `User ${userId}: Auto square-off complete. Total revenue credited: ₹${totalRevenue.toFixed(2)}. ` +
                `New balance: ₹${user.tradingBalance.toFixed(2)}`
            );
        }

        logger.success('✅ Auto Square-Off completed for all users.');

    } catch (error) {
        logger.error('Critical error in Auto Square-Off cron:', error);
    }
};

/**
 * Initialize the Auto Square-Off cron
 *
 * Schedule: 3:15 PM IST every weekday (Mon-Fri)
 * node-cron uses local server time — if your server is in IST, use: '15 15 * * 1-5'
 * If server is in UTC, 3:15 PM IST = 09:45 AM UTC: '45 9 * * 1-5'
 *
 * We use IST offset (UTC+5:30), so 3:15 PM IST = 09:45 AM UTC
 */
const startAutoSquareOffCron = () => {
    // Runs at 09:45 UTC = 3:15 PM IST, Mon-Fri
    cron.schedule('45 9 * * 1-5', () => {
        runAutoSquareOff();
    }, {
        timezone: 'UTC' // Explicitly set to UTC so cron fires correctly regardless of server timezone
    });

    logger.info('📅 Auto Square-Off Cron scheduled: 3:15 PM IST (09:45 UTC), Mon-Fri');
};

export default startAutoSquareOffCron;
