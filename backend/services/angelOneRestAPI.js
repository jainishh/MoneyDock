/**
 * Angel One REST API Service
 * Fetches stock quotes when market is closed or as fallback
 */

import { SmartAPI } from 'smartapi-javascript';
import { createLogger } from '../utils/logger.js';
import { getExchangeConfig } from '../config/exchanges.config.js';

const logger = createLogger('AngelOneREST');

class AngelOneRestAPI {
    constructor() {
        this.smartApi = null;
        this.isInitialized = false;

        // Rate limiting queue for candle data requests
        this.candleRequestQueue = [];
        this.isProcessingCandleQueue = false;
        // Angel One API rate limit: typically 3 requests per second
        this.CANDLE_REQUEST_DELAY_MS = 350; // Delay between API calls
        this.MAX_RETRIES = 3;
    }

    /**
     * Initialize REST API client
     * @param {object} credentials - Angel One credentials
     */
    async initialize(credentials) {
        try {
            const { jwtToken, apiKey, clientCode } = credentials;

            if (!jwtToken || !apiKey || !clientCode) {
                throw new Error('Missing required credentials');
            }

            // Always update credentials (even if already initialized)
            this.credentials = {
                jwtToken,
                apiKey,
                clientCode
            };

            this.smartApi = new SmartAPI({
                api_key: apiKey,
                access_token: jwtToken,
                client_code: clientCode
            });

            this.isInitialized = true;
            logger.success('REST API initialized/updated with fresh credentials');

            return { success: true };
        } catch (error) {
            logger.error('Failed to initialize REST API:', error);
            throw error;
        }
    }

    /**
     * Get LTP (Last Traded Price) for multiple stocks
     * @param {array} stocks - Array of stock objects with token and exch_seg
     * @returns {array} - Array of quotes
     */
    async getQuotes(stocks) {
        if (!this.isInitialized) {
            throw new Error('REST API not initialized');
        }

        try {
            logger.info(`Fetching quotes for ${stocks.length} stocks`);

            // Group stocks by exchange
            const exchangeGroups = this.groupByExchange(stocks);
            const allQuotes = [];

            // Fetch quotes for each exchange group
            for (const [exchSeg, stockList] of Object.entries(exchangeGroups)) {
                const quotes = await this.fetchExchangeQuotes(exchSeg, stockList);
                allQuotes.push(...quotes);
            }

            logger.success(`Fetched ${allQuotes.length} quotes successfully`);
            return allQuotes;

        } catch (error) {
            logger.error('Failed to fetch quotes:', error);
            throw error;
        }
    }

    /**
     * Fetch quotes for a specific exchange
     * @param {string} exchSeg - Exchange segment (NSE, NFO, etc.)
     * @param {array} stocks - Stocks for this exchange
     */
    async fetchExchangeQuotes(exchSeg, stocks) {
        const exchangeConfig = getExchangeConfig(exchSeg);

        if (!exchangeConfig) {
            logger.warn(`Unsupported exchange: ${exchSeg}`);
            return [];
        }

        try {
            const quotes = [];
            const apiUrl = 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/market/v1/quote/';

            // Angel One restricts maximum 50 tokens per request
            const CHUNK_SIZE = 50;
            const chunks = [];
            for (let i = 0; i < stocks.length; i += CHUNK_SIZE) {
                chunks.push(stocks.slice(i, i + CHUNK_SIZE));
            }

            logger.info(`Fetching quotes for ${exchSeg} in ${chunks.length} batches...`);

            for (let i = 0; i < chunks.length; i++) {
                const chunkStocks = chunks[i];
                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.credentials.jwtToken}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-UserType': 'USER',
                            'X-SourceID': 'WEB',
                            'X-ClientLocalIP': '127.0.0.1',
                            'X-ClientPublicIP': '127.0.0.1',
                            'X-MACAddress': 'MAC_ADDRESS',
                            'X-PrivateKey': this.credentials.apiKey
                        },
                        body: JSON.stringify({
                            mode: 'FULL',
                            exchangeTokens: {
                                [exchSeg]: chunkStocks.map(s => s.token)
                            }
                        })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        logger.error(`API HTTP Error ${response.status} for ${exchSeg} (Batch ${i + 1}):`, errorText);
                        continue;
                    }

                    const responseText = await response.text();
                    if (!responseText) {
                        logger.error(`API Error for ${exchSeg} (Batch ${i + 1}): Empty response body`);
                        continue;
                    }

                    let result;
                    try {
                        result = JSON.parse(responseText);
                    } catch (e) {
                        logger.error(`API JSON Parse Error for ${exchSeg} (Batch ${i + 1}):`, responseText.substring(0, 200));
                        continue;
                    }

                    if (result.status && result.data && result.data.fetched) {
                        result.data.fetched.forEach((stockData) => {
                            const token = stockData.symbolToken || stockData.token;
                            const stock = chunkStocks.find(s => s.token === token);

                            if (stock) {
                                quotes.push({
                                    token: token,
                                    exch_seg: exchSeg,
                                    symbol: stock.symbol || stock.name,
                                    ltp: stockData.ltp,
                                    change: stockData.netChange,
                                    percentChange: stockData.percentChange,
                                    open: stockData.open,
                                    high: stockData.high,
                                    low: stockData.low,
                                    close: stockData.close,
                                    volume: stockData.tradeVolume || stockData.volume || 0,
                                    oi: stockData.opnInterest || stockData.openInterest || 0,
                                    oiChange: stockData.netchangeInOI || stockData.netChangeinOpenInterest || 0,
                                    timestamp: Date.now()
                                });
                            }
                        });
                    } else {
                        logger.error(`API Error for ${exchSeg} (Batch ${i + 1}):`, JSON.stringify(result));
                    }

                } catch (batchError) {
                    logger.error(`Batch ${i + 1} Network/Parsing Error for ${exchSeg}:`, batchError.message);
                }
            }

            logger.info(`Processed ${quotes.length} quotes for ${exchSeg}`);
            return quotes;

        } catch (error) {
            logger.error(`Exchange ${exchSeg} quotes fetch failed:`, error);
            return [];
        }
    }

    /**
     * Group stocks by exchange
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
     * Get single stock quote
     * @param {string} token - Stock token
     * @param {string} exchSeg - Exchange segment
     */
    async getSingleQuote(token, exchSeg = 'NSE') {
        const quotes = await this.getQuotes([{ token, exch_seg: exchSeg }]);
        return quotes[0] || null;
    }

    /**
     * Get FULL market depth quote
     * @param {string} token - Stock token
     * @param {string} exchSeg - Exchange segment
     */
    async getMarketDepth(token, exchSeg = 'NSE') {
        if (!this.isInitialized) {
            throw new Error('REST API not initialized');
        }

        const apiUrl = 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/market/v1/quote/';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.credentials.jwtToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-UserType': 'USER',
                    'X-SourceID': 'WEB',
                    'X-ClientLocalIP': '127.0.0.1',
                    'X-ClientPublicIP': '127.0.0.1',
                    'X-MACAddress': 'MAC_ADDRESS',
                    'X-PrivateKey': this.credentials.apiKey
                },
                body: JSON.stringify({
                    mode: 'FULL',
                    exchangeTokens: {
                        [exchSeg]: [token]
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                logger.error(`API HTTP Error ${response.status} for Market Depth:`, errorText);
                return null;
            }

            const result = await response.json();

            if (result.status && result.data && result.data.fetched && result.data.fetched.length > 0) {
                return result.data.fetched[0];
            } else {
                logger.warn('No depth data returned for token:', token);
                return null;
            }

        } catch (error) {
            logger.error(`Market Depth fetch failed for token ${token}:`, error);
            return null;
        }
    }

    /**
     * Process the candle data request queue sequentially to respect rate limits
     */
    async processCandleQueue() {
        if (this.isProcessingCandleQueue || this.candleRequestQueue.length === 0) {
            return;
        }

        this.isProcessingCandleQueue = true;

        while (this.candleRequestQueue.length > 0) {
            const request = this.candleRequestQueue[0]; // Peek at the next request

            try {
                // Execute the API call
                const data = await this.smartApi.getCandleData({
                    exchange: request.params.exchange || 'NSE',
                    symboltoken: request.params.symboltoken,
                    interval: request.params.interval,
                    fromdate: request.params.fromdate,
                    todate: request.params.todate
                });

                // Request successful, resolve and remove from queue
                request.resolve(data);
                this.candleRequestQueue.shift();

            } catch (error) {
                // Check if it's a rate limit error (Too Many Requests / 429) or other retryable error
                const isRateLimitError = error?.message?.includes('Too Many Requests') || error?.message?.includes('429');

                if (isRateLimitError && request.retries < this.MAX_RETRIES) {
                    logger.warn(`Rate limit hit for ${request.params.symboltoken}. Retrying (${request.retries + 1}/${this.MAX_RETRIES})...`);
                    request.retries++;

                    // We DO NOT shift from the queue. We wait longer and try again.
                    await new Promise(resolve => setTimeout(resolve, this.CANDLE_REQUEST_DELAY_MS * 3)); // Backoff longer
                    continue; // Re-evaluate the while loop (same request)
                } else {
                    // Max retries reached or a non-retryable error
                    logger.error(`Failed to fetch candle data for ${request.params.symboltoken} after ${request.retries} retries:`, error?.message || error);
                    request.reject(error);
                    this.candleRequestQueue.shift();
                }
            }

            // Enforce delay between successful calls to avoid hitting rate limits proactively
            if (this.candleRequestQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, this.CANDLE_REQUEST_DELAY_MS));
            }
        }

        this.isProcessingCandleQueue = false;
    }

    /**
     * Get historical candle data
     * Parses the request into a promise queue to respect API rate limits.
     * @param {object} params - { exchange, symboltoken, interval, fromdate, todate }
     */
    async getCandleData({ exchange, symboltoken, interval, fromdate, todate }) {
        if (!this.isInitialized) {
            logger.error('getCandleData called but REST API not initialized');
            throw new Error('REST API not initialized');
        }

        // Validate input
        if (!symboltoken || !interval || !fromdate || !todate) {
            logger.error('Missing required parameters for getCandleData');
            return [];
        }

        logger.info(`Queueing candle data request: Token=${symboltoken}, Exch=${exchange}, Interval=${interval}, From=${fromdate}, To=${todate}`);

        // Return a Promise that will be resolved/rejected by the queue processor
        return new Promise((resolve, reject) => {
            const queueItem = {
                params: { exchange, symboltoken, interval, fromdate, todate },
                resolve: (data) => {
                    if (data && data.status && data.data) {
                        logger.success(`Fetched ${data.data.length} candles for ${symboltoken}`);
                        resolve(data.data);
                    } else {
                        logger.warn(`No candle data returned for ${symboltoken}. Status: ${data?.status}, Message: ${data?.message}`);
                        resolve([]);
                    }
                },
                reject,
                retries: 0
            };

            this.candleRequestQueue.push(queueItem);

            // Trigger queue processing if it's not already running
            this.processCandleQueue().catch(err => {
                logger.error('Error in candle queue processor:', err);
                this.isProcessingCandleQueue = false;
            });
        });
    }
}

// Export singleton instance
const restAPI = new AngelOneRestAPI();
export default restAPI;
