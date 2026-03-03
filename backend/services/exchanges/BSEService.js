/**
 * BSE Service
 * BSE Cash Market specific logic
 */

import { createLogger } from '../../utils/logger.js';
import { EXCHANGES } from '../../config/exchanges.config.js';

const logger = createLogger('BSEService');

class BSEService {
    constructor() {
        this.exchangeConfig = EXCHANGES.BSE;
    }

    /**
     * Validate BSE token
     */
    validateToken(token) {
        const tokenStr = String(token).trim();
        
        if (!/^\d{1,8}$/.test(tokenStr)) {
            logger.warn(`Invalid BSE token format: ${token}`);
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
                postClose: '15:40-16:00'
            },
            timezone: 'Asia/Kolkata'
        };
    }
}

export default BSEService;
