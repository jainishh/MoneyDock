/**
 * Validation Utilities
 * Validates tokens, exchange types, and subscription requests
 */

import { isExchangeSupported } from '../config/exchanges.config.js';
import { SUBSCRIPTION_MODES } from '../constants/subscriptionModes.js';

/**
 * Validate stock token
 */
export function isValidToken(token) {
    if (!token) return false;

    // Token should be a non-empty string or number
    const tokenStr = String(token).trim();
    return tokenStr.length > 0 && /^\d+$/.test(tokenStr);
}

/**
 * Validate stock object
 */
export function isValidStockObject(stock) {
    if (!stock || typeof stock !== 'object') return false;

    // Must have token
    if (!isValidToken(stock.token)) return false;

    // Must have exchange segment
    const exch = stock.exch_seg || stock.exchange;
    if (!exch || !isExchangeSupported(exch)) {
        return false;
    }

    return true;
}

/**
 * Validate subscription mode
 */
export function isValidMode(mode) {
    const validModes = Object.values(SUBSCRIPTION_MODES);
    return validModes.includes(mode);
}

/**
 * Validate subscription request
 */
export function validateSubscriptionRequest(request) {
    const errors = [];

    if (!request || typeof request !== 'object') {
        errors.push('Request must be an object');
        return { valid: false, errors };
    }

    // Validate tokens array
    if (!request.tokens || !Array.isArray(request.tokens)) {
        errors.push('Tokens must be an array');
    } else if (request.tokens.length === 0) {
        errors.push('Tokens array cannot be empty');
    }

    // Validate mode (optional, defaults to 2)
    if (request.mode !== undefined && !isValidMode(request.mode)) {
        errors.push(`Invalid mode: ${request.mode}. Must be 1, 2, or 3`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Sanitize and normalize stock tokens
 */
export function normalizeStockTokens(stocks) {
    if (!Array.isArray(stocks)) return [];

    return stocks
        .filter(stock => {
            // Accept either stock objects or plain tokens
            if (typeof stock === 'object') {
                return isValidStockObject(stock);
            }
            return isValidToken(stock);
        })
        .map(stock => {
            if (typeof stock === 'object') {
                return {
                    token: String(stock.token).trim(),
                    exch_seg: stock.exch_seg || stock.exchange || 'NSE',
                    symbol: stock.symbol || stock.name || '',
                    instrumenttype: stock.instrumenttype || ''
                };
            }
            // Plain token
            return {
                token: String(stock).trim(),
                exch_seg: 'NSE',
                symbol: '',
                instrumenttype: ''
            };
        });
}
