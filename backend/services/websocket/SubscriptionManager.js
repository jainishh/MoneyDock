/**
 * Subscription Manager
 * Manages stock subscriptions across multiple exchanges with different modes
 */

import { createLogger } from '../../utils/logger.js';
import { getExchangeConfig, getExchangeTypeId } from '../../config/exchanges.config.js';
import { SUBSCRIPTION_MODES } from '../../constants/subscriptionModes.js';
import { normalizeStockTokens } from '../../utils/validators.js';

const logger = createLogger('SubscriptionManager');

class SubscriptionManager {
    constructor(webSocketManager) {
        this.wsManager = webSocketManager;
        this.subscriptions = new Map(); // Map<token, { exch_seg, mode, symbol }>
    }

    /**
     * Subscribe to stocks with specified mode
     * @param {array} stocks - Array of stock objects or tokens
     * @param {number} mode - Subscription mode (1=LTP, 2=Quote, 3=SnapQuote)
     * @returns {object} - Subscription result
     */
    subscribeToStocks(stocks, mode = SUBSCRIPTION_MODES.QUOTE) {
        logger.info('subscribeToStocks called:', {
            stocksCount: stocks?.length,
            mode,
            modeDescription: mode === 1 ? 'LTP (Fast)' : mode === 2 ? 'Quote (OHLC)' : 'Snap Quote',
            totalSubscriptions: this.subscriptions.size
        });

        // Normalize and validate stocks
        const normalizedStocks = normalizeStockTokens(stocks);

        if (normalizedStocks.length === 0) {
            logger.warn('No valid stocks to subscribe');
            return { success: false, message: 'No valid stocks provided' };
        }

        // Group stocks by exchange
        const exchangeGroups = this.groupByExchange(normalizedStocks);

        let totalSubscribed = 0;
        const results = {};

        // Subscribe to each exchange group
        // Force re-subscription even if in cache (WebSocket might have reconnected)
        for (const [exchSeg, stockList] of Object.entries(exchangeGroups)) {
            const result = this.subscribeToExchange(exchSeg, stockList, mode, true); // true = force

            if (result.success) {
                totalSubscribed += result.count;
                results[exchSeg] = result.count;
            }
        }

        logger.success(`Total subscriptions: ${this.subscriptions.size} (added ${totalSubscribed})`);

        return {
            success: totalSubscribed > 0 || this.subscriptions.size > 0,
            totalSubscribed,
            exchangeBreakdown: results,
            totalSubscriptions: this.subscriptions.size
        };
    }

    /**
     * Subscribe to stocks in a specific exchange
     * @param {boolean} force - Force re-subscription even if cached
     */
    subscribeToExchange(exchSeg, stocks, mode, force = false) {
        const exchangeConfig = getExchangeConfig(exchSeg);

        if (!exchangeConfig) {
            logger.error(`Unsupported exchange: ${exchSeg}`);
            return { success: false, count: 0 };
        }

        // Filter out already subscribed tokens (unless force is true)
        const newStocks = force ? stocks : stocks.filter(stock => {
            const key = `${stock.token}_${exchSeg}`;
            return !this.subscriptions.has(key);
        });

        if (newStocks.length === 0 && !force) {
            logger.info(`All tokens already subscribed for ${exchSeg}`);
            return { success: true, count: 0 };
        }

        // Extract tokens
        const tokens = newStocks.map(s => s.token);

        // Create subscription request
        const request = {
            correlationID: `stock_market_${exchSeg.toLowerCase()}_${Date.now()}`,
            action: 1,  // Subscribe
            mode: mode,
            exchangeType: exchangeConfig.typeId,
            tokens: tokens
        };

        // Send subscription via WebSocket
        const result = this.wsManager.subscribe(request);

        if (result.success) {
            // Add to subscriptions map
            newStocks.forEach(stock => {
                const key = `${stock.token}_${exchSeg}`;
                this.subscriptions.set(key, {
                    token: stock.token,
                    exch_seg: exchSeg,
                    mode: mode,
                    symbol: stock.symbol,
                    instrumenttype: stock.instrumenttype
                });
            });

            logger.success(`Subscribed to ${tokens.length} stocks in ${exchSeg} (Mode ${mode})`);
        }

        return {
            success: result.success,
            count: newStocks.length
        };
    }

    /**
     * Unsubscribe from stocks
     * @param {array} tokens - Token strings or stock objects
     */
    unsubscribeFromStocks(tokens) {
        logger.info('Unsubscribing from stocks:', tokens.length);

        // Group tokens by exchange
        const exchangeGroups = {};

        tokens.forEach(token => {
            const tokenStr = typeof token === 'object' ? token.token : String(token);

            // Find in subscriptions
            for (const [key, sub] of this.subscriptions.entries()) {
                if (sub.token === tokenStr) {
                    if (!exchangeGroups[sub.exch_seg]) {
                        exchangeGroups[sub.exch_seg] = [];
                    }
                    exchangeGroups[sub.exch_seg].push(tokenStr);
                    this.subscriptions.delete(key);
                }
            }
        });

        // Send unsubscribe requests for each exchange
        for (const [exchSeg, tokenList] of Object.entries(exchangeGroups)) {
            const exchangeConfig = getExchangeConfig(exchSeg);

            if (exchangeConfig) {
                const request = {
                    correlationID: `unsubscribe_${exchSeg.toLowerCase()}`,
                    action: 0,  // Unsubscribe
                    mode: 2,
                    exchangeType: exchangeConfig.typeId,
                    tokens: tokenList
                };

                this.wsManager.subscribe(request);
                logger.info(`Unsubscribed from ${tokenList.length} tokens in ${exchSeg}`);
            }
        }

        return { success: true };
    }

    /**
     * Group stocks by exchange segment
     */
    groupByExchange(stocks) {
        const groups = {};

        stocks.forEach(stock => {
            const exchSeg = stock.exch_seg || 'NSE';

            if (!groups[exchSeg]) {
                groups[exchSeg] = [];
            }

            groups[exchSeg].push(stock);
        });

        return groups;
    }

    /**
     * Get current subscriptions
     */
    getSubscriptions() {
        return {
            total: this.subscriptions.size,
            subscriptions: Array.from(this.subscriptions.values())
        };
    }

    /**
     * Clear all subscriptions
     */
    clearSubscriptions() {
        this.subscriptions.clear();
        logger.info('All subscriptions cleared');
    }
}

export default SubscriptionManager;
