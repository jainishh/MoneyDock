/**
 * NSE Service
 * NSE Cash Market specific logic and validation
 */

import { createLogger } from '../../utils/logger.js';
import { EXCHANGES } from '../../config/exchanges.config.js';

const logger = createLogger('NSEService');

class NSEService {
    constructor() {
        this.exchangeConfig = EXCHANGES.NSE;
    }

    /**
     * Validate NSE token
     */
    validateToken(token) {
        // NSE tokens are typically 5-6 digit numbers
        const tokenStr = String(token).trim();
        
        if (!/^\d{1,8}$/.test(tokenStr)) {
            logger.warn(`Invalid NSE token format: ${token}`);
            return false;
        }
        
        return true;
    }

    /**
     * Get exchange info
     */
    getExchangeInfo() {
        return {
            ...this.exchangeConfig,
            marketHours: {
                preOpen: '09:00-09:15',
                trading: '09:15-15:30',
                postClose: '15:30-16:00'
            },
            timezone: 'Asia/Kolkata'
        };
    }
}

export default NSEService;
