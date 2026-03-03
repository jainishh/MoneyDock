import Order from '../models/Order.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('PositionController');

/**
 * Get Positions for User
 * Derives positions from completed orders by grouping by tradingsymbol
 * GET /api/position/
 */
export const getPositions = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.query.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        // Fetch all completed orders for this user
        const completedOrders = await Order.find({
            userId,
            orderstatus: 'complete'
        }).sort({ createdAt: -1 });

        if (completedOrders.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: []
            });
        }

        // Group orders by tradingsymbol to derive positions
        const positionMap = {};

        for (const order of completedOrders) {
            const key = order.tradingsymbol;

            if (!positionMap[key]) {
                positionMap[key] = {
                    tradingsymbol: order.tradingsymbol,
                    symboltoken: order.symboltoken,
                    exchange: order.exchange,
                    producttype: order.producttype,
                    buyQty: 0,
                    sellQty: 0,
                    buyValue: 0,  // total cost of buys
                    sellValue: 0, // total value of sells
                    orders: []
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
                pos.sellValue += qty * avgPrice;
            }

            pos.orders.push({
                orderId: order._id,
                type: order.transactiontype,
                qty: qty,
                price: avgPrice,
                time: order.createdAt
            });
        }

        // Build final positions array
        const positions = Object.values(positionMap).map(pos => {
            const netQty = pos.buyQty - pos.sellQty;
            const avgBuyPrice = pos.buyQty > 0 ? pos.buyValue / pos.buyQty : 0;
            const avgSellPrice = pos.sellQty > 0 ? pos.sellValue / pos.sellQty : 0;

            // For open positions (netQty != 0), avg price is the buy avg
            // For closed positions, P&L = sellValue - buyValue (for the matched qty)
            const matchedQty = Math.min(pos.buyQty, pos.sellQty);
            const realizedPnl = matchedQty > 0 ? (avgSellPrice - avgBuyPrice) * matchedQty : 0;

            return {
                tradingsymbol: pos.tradingsymbol,
                symboltoken: pos.symboltoken,
                exchange: pos.exchange,
                producttype: pos.producttype,
                transactiontype: netQty >= 0 ? 'BUY' : 'SELL',
                netQty: Math.abs(netQty),
                buyQty: pos.buyQty,
                sellQty: pos.sellQty,
                avgPrice: avgBuyPrice,
                avgSellPrice: avgSellPrice,
                realizedPnl: realizedPnl,
                buyValue: pos.buyValue,
                sellValue: pos.sellValue,
                orders: pos.orders
            };
        });

        return res.status(200).json({
            success: true,
            count: positions.length,
            data: positions
        });

    } catch (error) {
        logger.error('Get Positions Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch positions",
            error: error.message
        });
    }
};
