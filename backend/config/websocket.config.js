/**
 * WebSocket Configuration
 * Settings for Angel One WebSocket connection
 */

export const WEBSOCKET_CONFIG = {
    // Reconnection settings
    reconnection: {
        enabled: true,
        maxAttempts: 5,
        delay: 1000,        // 1 second
        maxDelay: 5000      // 5 seconds
    },

    // Heartbeat/Ping settings
    heartbeat: {
        interval: 30000,    // 30 seconds
        timeout: 10000      // 10 seconds
    },

    // Subscription settings
    subscription: {
        maxTokensPerRequest: 50,  // Max tokens per subscription request
        batchDelay: 100           // Delay between batch subscriptions (ms)
    },

    // Connection timeout
    connectionTimeout: 10000      // 10 seconds
};

export default WEBSOCKET_CONFIG;
