/**
 * CDS Service
 * Currency Derivatives specific logic
 */

import { createLogger } from '../../utils/logger.js';
import { EXCHANGES } from '../../config/exchanges.config.js';

const logger = createLogger('CDSService');

class CDSService {
    constructor() {
        this.exchangeConfig = EXCHANGES.CDS;
    }

    /**
     * Validate CDS token
     */
    validateToken(token) {
        const tokenStr = String(token).trim();
        
        if (!/^\d{1,8}$/.test(tokenStr)) {
            logger.warn(`Invalid CDS token format: ${token}`);
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
                trading: '09:00-17:00'
            },
            currencies: ['USDINR', 'EURINR', 'GBPINR', 'JPYINR'],
            timezone: 'Asia/Kolkata'
        };
    }
}

export default CDSService;
