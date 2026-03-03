import Order from '../models/Order.js';
import { smartApi } from '../config/angelConfig.js';
import AngelOneCredential from '../models/AngelOneCredential.js';
import { createLogger } from '../utils/logger.js';
import { isMarketOpen } from '../utils/marketHours.js';

import User from '../models/User.js';

const logger = createLogger('OrderController');

/**
 * Place a new order
 * POST /api/order/placeOrder
 */
export const placeOrder = async (req, res) => {
    try {
        const {
            variety,
            tradingsymbol,
            symboltoken,
            transactiontype,
            exchange,
            ordertype,
            producttype,

            price,
            marketPrice,
            quantity,
            squareoff,
            stoploss,
            trailingstoploss,
            triggerprice,
            tag
        } = req.body;

        // 1. Validate required fields (Basic validation)
        if (!tradingsymbol || !symboltoken || !transactiontype || !exchange || !ordertype || !producttype || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Missing required order fields"
            });
        }

        // Price can be 0 for MARKET orders
        if (price === undefined || price === null) {
            return res.status(400).json({
                success: false,
                message: "Missing price field"
            });
        }

        // 2. Create Order in DB
        const userId = req.user ? req.user._id : req.body.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.tradingBalance <= 0) {
            // Bypass this check if the user is selling equity (NSE or BSE), 
            // because they can sell their holdings regardless of balance.
            // For options (NFO), we still check.
            if (!(transactiontype === 'SELL' && (exchange === 'NSE' || exchange === 'BSE'))) {
                return res.status(400).json({
                    success: false,
                    message: "Trading balance is zero or negative. Cannot place orders."
                });
            }
        }

        const estimatedCost = (marketPrice || price || 0) * quantity;

        if (transactiontype === 'BUY' && estimatedCost > user.tradingBalance) {
            return res.status(400).json({
                success: false,
                message: `Insufficient trading balance. Order cost: ${estimatedCost}, Available balance: ${user.tradingBalance}`
            });
        }

        // --- NEW: SELL VALIDATION ---
        if (transactiontype === 'SELL' && (exchange === 'NSE' || exchange === 'BSE')) {
            const completedOrders = await Order.find({
                userId,
                tradingsymbol,
                orderstatus: 'complete'
            });

            let netQty = 0;
            completedOrders.forEach(order => {
                const qty = order.filledShares || order.quantity;
                if (order.transactiontype === 'BUY') netQty += qty;
                else netQty -= qty;
            });

            if (netQty < quantity) {
                return res.status(400).json({
                    success: false,
                    message: "You Don't have enough holdings to sell"
                });
            }
        }

        const newOrder = new Order({
            userId,
            variety,
            tradingsymbol,
            symboltoken,
            transactiontype,
            exchange,
            ordertype,
            producttype,

            price,
            marketPriceAtOrder: marketPrice || price || 0,
            quantity,
            squareoff,
            stoploss,
            trailingstoploss,
            triggerprice,
            tag,
        });

        // --- NEW: MARKET HOUR ENFORCEMENT ---
        const marketOpen = isMarketOpen();

        if (!marketOpen) {
            newOrder.orderstatus = "pending";
            newOrder.message = "Market Closed - Order Pending";

            if (transactiontype === 'BUY') {
                user.tradingBalance -= estimatedCost;
                await user.save();
            }

            await newOrder.save();

            return res.status(200).json({
                success: true,
                message: "Market is closed. Your order has been placed as PENDING.",
                data: {
                    orderId: newOrder._id,
                    status: "pending",
                    tradingBalance: user.tradingBalance
                }
            });
        }

        await newOrder.save();
        logger.info(`Order created in DB: ${newOrder._id}`);

        // 3. Place Order via Angel One API
        // ... (API placement logic remains same)

        // PAPER TRADING MODE: Simulate Success
        logger.info('PAPER TRADING: Simulating Angel One Order Placement');
        const mockResponse = {
            status: true,
            message: "SUCCESS",
            data: {
                orderid: "PAPER-" + Date.now(),
                uniqueorderid: "UID-" + Date.now(),
                script: tradingsymbol
            }
        };

        try {
            // const response = await smartApi.placeOrder(orderParams);
            const response = mockResponse;

            logger.info('Angel One Place Order Response (MOCKED):', response);

            if (response.status && response.data && response.data.orderid) {
                // Success
                newOrder.angelOrderId = response.data.orderid;
                newOrder.uniqueorderid = response.data.uniqueorderid;

                if (ordertype === "LIMIT") {
                    newOrder.orderstatus = "pending";
                    newOrder.averagePrice = price;
                    newOrder.message = "Order Placed (Pending)";

                    if (transactiontype === 'BUY') {
                        user.tradingBalance -= estimatedCost;
                        await user.save();
                    }
                } else {
                    const executionPrice = marketPrice || price || 0;
                    newOrder.orderstatus = "complete";
                    newOrder.averagePrice = executionPrice;
                    newOrder.filledShares = quantity;
                    newOrder.unfilledShares = 0;
                    newOrder.message = "Order Executed";

                    // Update user's trading balance
                    if (transactiontype === 'BUY') {
                        user.tradingBalance -= (executionPrice * quantity);
                    } else if (transactiontype === 'SELL') {
                        user.tradingBalance += (executionPrice * quantity);
                    }
                    await user.save();
                    // --- NEW: AUTO-PLACE Child STOPLOSS / SQUAREOFF order ---
                    // According to REAL stock market logic, if you provide a stoploss target 
                    // AND the order executes, new "pending" child orders sit on the order book.
                    const childrenOrders = [];

                    if (stoploss && stoploss > 0) {
                        childrenOrders.push(new Order({
                            userId,
                            variety: 'STOPLOSS',
                            tradingsymbol,
                            symboltoken,
                            // If they bought, the stoploss order must be SELL
                            transactiontype: transactiontype === 'BUY' ? 'SELL' : 'BUY',
                            exchange,
                            ordertype: 'STOPLOSS_MARKET',
                            producttype,
                            price: 0,
                            triggerprice: stoploss, // Trigger target price
                            quantity,
                            angelOrderId: "CHILD-SL-" + Date.now(),
                            uniqueorderid: "C-UID-" + Date.now(),
                            message: `Auto-placed Stop Loss child order`,
                            orderstatus: "pending",
                            tag: 'AUTO_STOPLOSS'
                        }));
                    }

                    if (squareoff && squareoff > 0) {
                        childrenOrders.push(new Order({
                            userId,
                            variety: 'NORMAL',
                            tradingsymbol,
                            symboltoken,
                            // If they bought, squareoff target order must be SELL (which is a LIMIT above current price)
                            transactiontype: transactiontype === 'BUY' ? 'SELL' : 'BUY',
                            exchange,
                            ordertype: 'LIMIT',
                            producttype,
                            price: squareoff,
                            quantity,
                            angelOrderId: "CHILD-SQ-" + Date.now(),
                            uniqueorderid: "C-UID-" + Date.now() + 1,
                            message: `Auto-placed Target SquareOff child order`,
                            orderstatus: "pending",
                            tag: 'AUTO_SQUAREOFF'
                        }));
                    }

                    if (childrenOrders.length > 0) {
                        try {
                            await Order.insertMany(childrenOrders);
                            logger.info(`Placed ${childrenOrders.length} child trigger orders for base order ${newOrder._id}`);
                        } catch (childErr) {
                            logger.error('Failed to log child orders:', childErr.message);
                        }
                    }
                }

                await newOrder.save();

                return res.status(200).json({
                    success: true,
                    message: newOrder.message,
                    data: {
                        orderId: newOrder._id,
                        angelOrderId: response.data.orderid,
                        script: response.data.script,
                        status: newOrder.orderstatus,
                        tradingBalance: user.tradingBalance
                    }
                });
            } else {
                // Failed at Angel One
                newOrder.message = response.message || "Unknown error from Angel One";
                newOrder.orderstatus = "rejected";
                await newOrder.save();

                return res.status(400).json({
                    success: false,
                    message: response.message || "Failed to place order at Angel One",
                    errorCode: response.errorcode
                });
            }

        } catch (apiError) {
            logger.error('Angel One API Error:', apiError);
            newOrder.message = apiError.message;
            await newOrder.save();

            return res.status(500).json({
                success: false,
                message: "Internal Error calling Angel One API",
                error: apiError.message
            });
        }

    } catch (error) {
        logger.error('Place Order Controller Error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

/**
 * Get Order History for User
 * GET /api/order/history
 */
export const getOrderHistory = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.query.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        logger.error('Get Order History Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order history",
            error: error.message
        });
    }
};
/**
 * Cancel an Order
 * POST /api/order/cancel
 */
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user ? req.user._id : req.body.userId;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (['complete', 'rejected', 'cancelled'].includes(order.orderstatus)) {
            return res.status(400).json({ success: false, message: "Cannot cancel a completed or rejected order" });
        }

        let refundUser = null;
        if (order.orderstatus === 'pending' && order.transactiontype === 'BUY') {
            refundUser = await User.findById(userId);
            if (refundUser) {
                const refund = (order.price || order.marketPriceAtOrder || 0) * order.quantity;
                refundUser.tradingBalance += refund;
                await refundUser.save();
            }
        }

        order.orderstatus = 'cancelled';
        order.message = 'Order Cancelled by User';
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order Cancelled Successfully",
            data: {
                orderId: order._id,
                status: order.orderstatus,
                tradingBalance: refundUser ? refundUser.tradingBalance : undefined
            }
        });

    } catch (error) {
        logger.error('Cancel Order Error:', error);
        return res.status(500).json({ success: false, message: "Failed to cancel order", error: error.message });
    }
};

/**
 * Modify an Order
 * POST /api/order/modify
 */
export const modifyOrder = async (req, res) => {
    try {
        const { orderId, price, quantity, ordertype } = req.body;
        const userId = req.user ? req.user._id : req.body.userId;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (['complete', 'rejected', 'cancelled'].includes(order.orderstatus)) {
            return res.status(400).json({ success: false, message: "Cannot modify a completed or rejected order" });
        }

        // Update fields if provided
        if (price !== undefined) order.price = price;
        if (quantity !== undefined) {
            order.quantity = quantity;
            order.unfilledShares = quantity - order.filledShares; // Update unfilled shares logic roughly
        }
        if (ordertype !== undefined) order.ordertype = ordertype;

        order.message = 'Order Modified';
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order Modified Successfully",
            data: order
        });

    } catch (error) {
        logger.error('Modify Order Error:', error);
        return res.status(500).json({ success: false, message: "Failed to modify order", error: error.message });
    }
};
