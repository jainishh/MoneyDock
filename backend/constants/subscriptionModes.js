/**
 * Subscription Mode Constants
 * Determines what data is sent in tick updates
 */

export const SUBSCRIPTION_MODES = {
    LTP: 1,         // Last Traded Price only (fastest, least data)
    QUOTE: 2,       // LTP + OHLC + Volume (standard)
    SNAP_QUOTE: 3   // Full market depth + order book (most data)
};

export const MODE_DESCRIPTIONS = {
    1: 'LTP Only - Fast updates for watchlist',
    2: 'Quote Mode - OHLC + Volume',
    3: 'Snap Quote - Full market depth'
};

export const MODE_DATA_SIZE = {
    1: 8,     // bytes - Token + LTP
    2: 32,    // bytes - Token + LTP + OHLC + Volume
    3: null   // variable - Full depth data
};

/**
 * Get recommended mode for use case
 */
export function getRecommendedMode(useCase) {
    const recommendations = {
        'watchlist': SUBSCRIPTION_MODES.LTP,
        'chart': SUBSCRIPTION_MODES.QUOTE,
        'orderbook': SUBSCRIPTION_MODES.SNAP_QUOTE,
        'detailed': SUBSCRIPTION_MODES.QUOTE,
        'trading': SUBSCRIPTION_MODES.QUOTE
    };
    
    return recommendations[useCase] || SUBSCRIPTION_MODES.QUOTE;
}

export default SUBSCRIPTION_MODES;
