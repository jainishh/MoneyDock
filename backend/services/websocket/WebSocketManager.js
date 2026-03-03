/**
 * WebSocket Manager
 * Manages Angel One WebSocket connection lifecycle
 */

import { WebSocketV2 } from 'smartapi-javascript';
import { createLogger } from '../../utils/logger.js';
import WEBSOCKET_CONFIG from '../../config/websocket.config.js';

const logger = createLogger('WebSocketManager');

class WebSocketManager {
    constructor() {
        this.webSocket = null;
        this.isConnected = false;
        this.credentials = null;
        this.reconnectAttempts = 0;
    }

    /**
     * Connect to Angel One WebSocket
     * @param {object} credentials - { feedToken, jwtToken, clientCode, apiKey }
     */
    async connect(credentials) {
        try {
            const { feedToken, jwtToken, clientCode, apiKey } = credentials;

            if (!feedToken || !jwtToken || !clientCode) {
                throw new Error('Missing required credentials (feedToken, jwtToken, clientCode)');
            }

            // Store credentials for reconnection
            this.credentials = credentials;

            // Initialize WebSocketV2
            this.webSocket = new WebSocketV2({
                jwttoken: jwtToken,
                apikey: apiKey || process.env.ANGEL_API_KEY,
                clientcode: clientCode,
                feedtype: feedToken
            });

            // Connect to WebSocket
            await this.webSocket.connect();

            // MONKEY PATCH: The smartapi-javascript library has a bug where its internal heartbeat
            // (pingInterval) might fire before the socket is fully open or after it closes, causing a fatal crash.
            // We patch the underlying ws.send to silently ignore sends if not OPEN.
            if (this.webSocket.ws) {
                const originalSend = this.webSocket.ws.send;
                this.webSocket.ws.send = function (data, options, cb) {
                    if (this.readyState === 1) { // 1 is WebSocket.OPEN
                        originalSend.call(this, data, options, cb);
                    } else {
                        logger.warn(`Ignored ws.send because readyState is ${this.readyState}`);
                    }
                };
            }

            this.isConnected = true;
            this.reconnectAttempts = 0;

            logger.success('Connected to Angel One WebSocket');

            return { success: true };

        } catch (error) {
            logger.error('Angel One WebSocket connection failed:', error);
            this.isConnected = false;
            throw error;
        }
    }

    /**
     * Setup event listeners
     * @param {object} handlers - { onTick, onError, onClose }
     */
    setupEventListeners(handlers) {
        if (!this.webSocket) {
            logger.warn('Cannot setup listeners - WebSocket not initialized');
            return;
        }

        const { onTick, onError, onClose } = handlers;

        // Handle tick data
        if (onTick) {
            this.webSocket.on('tick', (tickData) => {
                // Filter out heartbeat messages
                if (tickData === 'pong' || tickData === 'ping') {
                    return;
                }
                onTick(tickData);
            });
        }

        // Handle errors
        if (onError) {
            this.webSocket.on('error', (error) => {
                logger.error('WebSocket Error:', error);
                onError(error);
            });
        }

        // Handle disconnection
        if (onClose) {
            this.webSocket.on('close', () => {
                logger.warn('Angel One WebSocket closed');
                this.isConnected = false;
                onClose();
            });
        }

        logger.info('Event listeners configured');
    }

    /**
     * Send subscription request
     * @param {object} request - { correlationID, action, mode, exchangeType, tokens }
     */
    async subscribe(request) {
        if (!this.isConnected || !this.webSocket) {
            logger.error('Cannot subscribe - WebSocket not connected');
            return { success: false, message: 'WebSocket not connected' };
        }

        // Wait for WebSocket to be fully open before subscribing
        if (this.webSocket.ws && this.webSocket.ws.readyState !== 1) { // 1 = OPEN
            logger.warn(`WebSocket is not open (readyState ${this.webSocket.ws.readyState}). Waiting...`);
            await new Promise(resolve => setTimeout(resolve, 500));

            if (this.webSocket.ws && this.webSocket.ws.readyState !== 1) {
                logger.error('WebSocket failed to reach OPEN state after waiting.');
                return { success: false, message: 'WebSocket not ready' };
            }
        }

        try {
            this.webSocket.fetchData(request);
            logger.debug('Subscription request sent:', {
                correlationID: request.correlationID,
                action: request.action,
                mode: request.mode,
                exchangeType: request.exchangeType,
                tokenCount: request.tokens.length
            });

            return { success: true };
        } catch (error) {
            logger.error('Subscription request failed:', error);
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
                this.credentials = null;
                logger.info('WebSocket disconnected');
            } catch (error) {
                logger.error('Error disconnecting WebSocket:', error);
            }
        }
    }

    /**
     * Get connection status
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            hasCredentials: !!this.credentials
        };
    }

    /**
     * Reconnect to WebSocket
     */
    async reconnect() {
        if (!this.credentials) {
            logger.error('Cannot reconnect - no credentials stored');
            return { success: false, message: 'No credentials available' };
        }

        if (this.reconnectAttempts >= WEBSOCKET_CONFIG.reconnection.maxAttempts) {
            logger.error('Max reconnection attempts reached');
            return { success: false, message: 'Max reconnection attempts exceeded' };
        }

        this.reconnectAttempts++;
        logger.info(`Reconnection attempt ${this.reconnectAttempts}/${WEBSOCKET_CONFIG.reconnection.maxAttempts}`);

        try {
            await this.connect(this.credentials);
            return { success: true };
        } catch (error) {
            logger.error(`Reconnection attempt ${this.reconnectAttempts} failed:`, error);
            return { success: false, message: error.message };
        }
    }
}

export default WebSocketManager;
