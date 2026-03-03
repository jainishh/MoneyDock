import { WebSocketV2 } from 'smartapi-javascript';
import dotenv from 'dotenv';

dotenv.config();

class AngelOneWebSocketManager {
    constructor() {
        this.webSocket = null;
        this.isConnected = false;
        this.socketIOServer = null;
        this.subscriptions = new Set();
    }

    /**
     * Initialize Socket.IO server
     * @param {object} io - Socket.IO server instance
     */
    setSocketIOServer(io) {
        this.socketIOServer = io;
        console.log('✅ Socket.IO server configured for Angel One WebSocket');
    }

    /**
     * Connect to Angel One WebSocket
     * @param {object} credentials - Angel One session credentials
     */
    async connect(credentials) {
        try {
            const { feedToken, jwtToken, clientCode, apiKey } = credentials;

            if (!feedToken || !jwtToken || !clientCode) {
                throw new Error('Missing required credentials');
            }

            // Initialize WebSocketV2
            this.webSocket = new WebSocketV2({
                jwttoken: jwtToken,
                apikey: apiKey || process.env.ANGEL_API_KEY,
                clientcode: clientCode,
                feedtype: feedToken
            });

            // Connect to WebSocket
            await this.webSocket.connect();
            this.isConnected = true;
            console.log('✅ Connected to Angel One WebSocket');

            // Set up event listeners
            this.setupEventListeners();

            return { success: true };

        } catch (error) {
            console.error('❌ Angel One WebSocket connection failed:', error);
            this.isConnected = false;
            throw error;
        }
    }

    /**
     * Setup WebSocket event listeners
     */
    setupEventListeners() {
        if (!this.webSocket) return;

        // Handle tick data
        this.webSocket.on('tick', (tickData) => {
            // Filter out heartbeat/pong messages
            if (tickData === 'pong' || tickData === 'ping') {
                // Ignore heartbeat messages
                return;
            }
            
            console.log('📊 Received tick data:', {
                type: typeof tickData,
                length: tickData?.length,
                isBuffer: tickData instanceof Buffer,
                isArray: Array.isArray(tickData),
                content: tickData,
                firstBytes: tickData?.slice?.(0, 20)
            });
            
            // Broadcast to all connected Socket.IO clients
            if (this.socketIOServer) {
                this.socketIOServer.emit('tick_data', tickData);
            }
        });

        // Handle errors
        this.webSocket.on('error', (error) => {
            console.error('Angel One WebSocket Error:', error);
            if (this.socketIOServer) {
                this.socketIOServer.emit('websocket_error', { 
                    message: error.message || 'WebSocket error occurred' 
                });
            }
        });

        // Handle disconnection
        this.webSocket.on('close', () => {
            console.log('⚠️ Angel One WebSocket closed');
            this.isConnected = false;
            if (this.socketIOServer) {
                this.socketIOServer.emit('websocket_disconnected');
            }
        });
    }

    /**
     * Subscribe to stock tokens
     * @param {array} stocks - Stock objects with token and exch_seg
     */
    subscribeToStocks(stocks) {
        console.log('📝 subscribeToStocks called:', {
            isConnected: this.isConnected,
            hasWebSocket: !!this.webSocket,
            stocksCount: stocks.length,
            subscriptionsSize: this.subscriptions.size
        });
        
        if (!this.isConnected || !this.webSocket) {
            console.error('❌ WebSocket not connected - cannot subscribe');
            return { success: false, message: 'WebSocket not connected' };
        }

        try {
            // Group stocks by exchange
            const nseStocks = [];
            const nfoStocks = [];
            
            stocks.forEach(stock => {
                const token = stock.token || stock;
                
                // Skip if already subscribed
                if (this.subscriptions.has(token)) {
                    return;
                }
                
                // Determine exchange type
                const exchangeSeg = stock.exch_seg || 'NSE';
                if (exchangeSeg === 'NFO') {
                    nfoStocks.push(token);
                } else {
                    nseStocks.push(token);
                }
            });

            if (nseStocks.length === 0 && nfoStocks.length === 0) {
                console.log('⚠️ All tokens already subscribed');
                return { success: true, message: 'Already subscribed' };
            }

            // Subscribe to NSE stocks
            if (nseStocks.length > 0) {
                const nseRequest = {
                    correlationID: "stock_market_app_nse",
                    action: 1, // Subscribe
                    mode: 2,   // Quote mode (OHLC + LTP)
                    exchangeType: 1, // NSE
                    tokens: nseStocks
                };
                this.webSocket.fetchData(nseRequest);
                nseStocks.forEach(token => this.subscriptions.add(token));
                console.log(`📊 Subscribed to ${nseStocks.length} NSE stocks`);
            }

            // Subscribe to NFO stocks (Futures & Options)
            if (nfoStocks.length > 0) {
                const nfoRequest = {
                    correlationID: "stock_market_app_nfo",
                    action: 1, // Subscribe
                    mode: 2,   // Quote mode
                    exchangeType: 2, // NFO
                    tokens: nfoStocks
                };
                this.webSocket.fetchData(nfoRequest);
                nfoStocks.forEach(token => this.subscriptions.add(token));
                console.log(`📊 Subscribed to ${nfoStocks.length} NFO stocks`);
            }

            console.log(`✅ Total subscriptions: ${this.subscriptions.size}`);

            return { 
                success: true, 
                subscribedCount: nseStocks.length + nfoStocks.length,
                nseCount: nseStocks.length,
                nfoCount: nfoStocks.length,
                totalSubscriptions: this.subscriptions.size
            };

        } catch (error) {
            console.error('Subscription error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Unsubscribe from stock tokens
     * @param {array} tokens - Stock tokens to unsubscribe
     */
    unsubscribeFromStocks(tokens) {
        if (!this.isConnected || !this.webSocket) {
            return { success: false, message: 'WebSocket not connected' };
        }

        try {
            const subscriptionRequest = {
                correlationID: "stock_market_app",
                action: 0, // Unsubscribe
                mode: 2,
                exchangeType: 1,
                tokens: tokens
            };

            this.webSocket.fetchData(subscriptionRequest);

            // Remove from subscriptions set
            tokens.forEach(token => this.subscriptions.delete(token));

            console.log(`Unsubscribed from ${tokens.length} stocks`);

            return { success: true };

        } catch (error) {
            console.error('Unsubscribe error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Close WebSocket connection
     */
    disconnect() {
        if (this.webSocket) {
            try {
                this.webSocket.close();
                this.isConnected = false;
                this.subscriptions.clear();
                console.log('Angel One WebSocket disconnected');
            } catch (error) {
                console.error('Error disconnecting WebSocket:', error);
            }
        }
    }

    /**
     * Get connection status
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            subscriptionsCount: this.subscriptions.size,
            subscriptions: Array.from(this.subscriptions)
        };
    }
}

// Export singleton instance
export default new AngelOneWebSocketManager();
