import Order from '../models/Order.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('PortfolioController');

/**
 * Get Portfolio Holdings for User
 * Derives holdings from completed BUY orders grouped by tradingsymbol.
 * Nets out any SELL orders so we only show what the user still holds.
 *
 * GET /api/portfolio/holdings?userId=<id>
 */
export const getHoldings = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.query.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // Fetch ALL completed orders for user
        const completedOrders = await Order.find({
            userId,
            orderstatus: 'complete'
        }).sort({ createdAt: 1 }); // oldest first for FIFO avg price

        if (completedOrders.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                holdings: [],
                summary: {
                    totalInvested: 0,
                    totalRealizedPnl: 0,
                    holdingsCount: 0
                }
            });
        }

        // ── Group by tradingsymbol using FIFO ────────────────────────────────
        const symbolMap = {};

        for (const order of completedOrders) {
            const key = order.tradingsymbol;
            if (!symbolMap[key]) {
                symbolMap[key] = {
                    tradingsymbol: order.tradingsymbol,
                    symboltoken: order.symboltoken,
                    exchange: order.exchange,
                    producttype: order.producttype,
                    buyLots: [], // Array of { qty, price }
                    sellLots: [], // Array for tracking shorts if needed
                    realizedPnl: 0,
                    netQty: 0
                };
            }

            const pos = symbolMap[key];
            const qty = order.filledShares || order.quantity;
            const price = order.averagePrice || order.price || 0;

            if (order.transactiontype === 'BUY') {
                pos.netQty += qty;

                // If closing a short position
                if (pos.sellLots.length > 0) {
                    let remainingBuyQty = qty;
                    while (remainingBuyQty > 0 && pos.sellLots.length > 0) {
                        const oldestSell = pos.sellLots[0];
                        if (oldestSell.qty <= remainingBuyQty) {
                            pos.realizedPnl += (oldestSell.price - price) * oldestSell.qty;
                            remainingBuyQty -= oldestSell.qty;
                            pos.sellLots.shift();
                        } else {
                            pos.realizedPnl += (oldestSell.price - price) * remainingBuyQty;
                            oldestSell.qty -= remainingBuyQty;
                            remainingBuyQty = 0;
                        }
                    }
                    if (remainingBuyQty > 0) pos.buyLots.push({ qty: remainingBuyQty, price });
                } else {
                    pos.buyLots.push({ qty, price });
                }
            } else if (order.transactiontype === 'SELL') {
                pos.netQty -= qty;

                // Match with buy lots (FIFO for Long positions)
                if (pos.buyLots.length > 0) {
                    let remainingSellQty = qty;
                    while (remainingSellQty > 0 && pos.buyLots.length > 0) {
                        const oldestBuy = pos.buyLots[0];
                        if (oldestBuy.qty <= remainingSellQty) {
                            pos.realizedPnl += (price - oldestBuy.price) * oldestBuy.qty;
                            remainingSellQty -= oldestBuy.qty;
                            pos.buyLots.shift();
                        } else {
                            pos.realizedPnl += (price - oldestBuy.price) * remainingSellQty;
                            oldestBuy.qty -= remainingSellQty;
                            remainingSellQty = 0;
                        }
                    }
                    if (remainingSellQty > 0) pos.sellLots.push({ qty: remainingSellQty, price });
                } else {
                    pos.sellLots.push({ qty, price });
                }
            }
        }

        // ── Build holdings array (only where netQty !== 0) ──────────────────
        const holdings = [];
        let totalInvested = 0;
        let totalRealizedPnl = 0;

        for (const pos of Object.values(symbolMap)) {
            totalRealizedPnl += pos.realizedPnl;

            // Calculate current invested value & net quantity from remaining buyLots
            let currentInvested = 0;
            let currentQty = 0;
            for (const lot of pos.buyLots) {
                currentInvested += lot.qty * lot.price;
                currentQty += lot.qty;
            }

            // Short quantities
            let shortInvested = 0;
            let shortQty = 0;
            for (const lot of pos.sellLots) {
                shortInvested += lot.qty * lot.price;
                shortQty += lot.qty;
            }

            if (currentQty > 0) {
                const avgBuyPrice = currentInvested / currentQty;
                totalInvested += currentInvested;

                holdings.push({
                    tradingsymbol: pos.tradingsymbol,
                    symboltoken: pos.symboltoken,
                    exchange: pos.exchange,
                    producttype: pos.producttype,
                    netQty: currentQty,
                    avgBuyPrice: parseFloat(avgBuyPrice.toFixed(2)),
                    investedValue: parseFloat(currentInvested.toFixed(2)),
                    realizedPnl: parseFloat(pos.realizedPnl.toFixed(2)),
                    ltp: null,
                    unrealizedPnl: null,
                });
            } else if (shortQty > 0) {
                // SHORT position — included for completeness
                const avgShortPrice = shortInvested / shortQty;
                holdings.push({
                    tradingsymbol: pos.tradingsymbol,
                    symboltoken: pos.symboltoken,
                    exchange: pos.exchange,
                    producttype: pos.producttype,
                    netQty: -shortQty,   // negative = short
                    avgBuyPrice: parseFloat(avgShortPrice.toFixed(2)), // Storing short entry price here
                    investedValue: parseFloat(shortInvested.toFixed(2)),
                    realizedPnl: parseFloat(pos.realizedPnl.toFixed(2)),
                    ltp: null,
                    unrealizedPnl: null,
                });
            }
        }

        // Sort: largest invested value first
        holdings.sort((a, b) => b.investedValue - a.investedValue);

        logger.success(`Portfolio: ${holdings.length} holdings for user ${userId}`);

        return res.status(200).json({
            success: true,
            count: holdings.length,
            holdings,
            summary: {
                totalInvested: parseFloat(totalInvested.toFixed(2)),
                totalRealizedPnl: parseFloat(totalRealizedPnl.toFixed(2)),
                holdingsCount: holdings.length,
            }
        });

    } catch (error) {
        logger.error('Get Holdings Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch portfolio holdings',
            error: error.message
        });
    }
};

/**
 * Get Portfolio Summary (lightweight endpoint)
 * GET /api/portfolio/summary?userId=<id>
 */
export const getPortfolioSummary = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.query.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const completedOrders = await Order.find({ userId, orderstatus: 'complete' });

        // Group by tradingsymbol using FIFO to calculate summary
        const symbolMap = {};
        let totalOrders = 0;

        for (const order of completedOrders) {
            totalOrders++;
            const key = order.tradingsymbol;
            if (!symbolMap[key]) {
                symbolMap[key] = {
                    buyLots: [],
                    sellLots: [],
                    realizedPnl: 0,
                    netQty: 0
                };
            }

            const pos = symbolMap[key];
            const qty = order.filledShares || order.quantity;
            const price = order.averagePrice || order.price || 0;

            if (order.transactiontype === 'BUY') {
                pos.netQty += qty;
                if (pos.sellLots.length > 0) {
                    let remainingBuyQty = qty;
                    while (remainingBuyQty > 0 && pos.sellLots.length > 0) {
                        const oldestSell = pos.sellLots[0];
                        if (oldestSell.qty <= remainingBuyQty) {
                            pos.realizedPnl += (oldestSell.price - price) * oldestSell.qty;
                            remainingBuyQty -= oldestSell.qty;
                            pos.sellLots.shift();
                        } else {
                            pos.realizedPnl += (oldestSell.price - price) * remainingBuyQty;
                            oldestSell.qty -= remainingBuyQty;
                            remainingBuyQty = 0;
                        }
                    }
                    if (remainingBuyQty > 0) pos.buyLots.push({ qty: remainingBuyQty, price });
                } else {
                    pos.buyLots.push({ qty, price });
                }
            } else {
                pos.netQty -= qty;
                if (pos.buyLots.length > 0) {
                    let remainingSellQty = qty;
                    while (remainingSellQty > 0 && pos.buyLots.length > 0) {
                        const oldestBuy = pos.buyLots[0];
                        if (oldestBuy.qty <= remainingSellQty) {
                            pos.realizedPnl += (price - oldestBuy.price) * oldestBuy.qty;
                            remainingSellQty -= oldestBuy.qty;
                            pos.buyLots.shift();
                        } else {
                            pos.realizedPnl += (price - oldestBuy.price) * remainingSellQty;
                            oldestBuy.qty -= remainingSellQty;
                            remainingSellQty = 0;
                        }
                    }
                    if (remainingSellQty > 0) pos.sellLots.push({ qty: remainingSellQty, price });
                } else {
                    pos.sellLots.push({ qty, price });
                }
            }
        }

        let realizedPnl = 0;
        let netInvested = 0;

        for (const pos of Object.values(symbolMap)) {
            realizedPnl += pos.realizedPnl;
            for (const lot of pos.buyLots) {
                netInvested += lot.qty * lot.price;
            }
        }

        return res.status(200).json({
            success: true,
            summary: {
                totalBuyValue: parseFloat(totalBuyValue.toFixed(2)),
                totalSellValue: parseFloat(totalSellValue.toFixed(2)),
                netInvested: parseFloat(Math.max(netInvested, 0).toFixed(2)),
                realizedPnl: parseFloat(realizedPnl.toFixed(2)),
                totalOrders: totalOrders,
                uniqueSymbols: Object.keys(symbolMap).length,
            }
        });

    } catch (error) {
        logger.error('Get Portfolio Summary Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch summary',
            error: error.message
        });
    }
};
