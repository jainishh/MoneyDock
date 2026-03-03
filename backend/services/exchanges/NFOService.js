/**
 * NFO Service
 * NSE Futures & Options specific logic
 */

import { createLogger } from '../../utils/logger.js';
import { EXCHANGES } from '../../config/exchanges.config.js';
import { isFutures, isOptions } from '../../constants/instrumentTypes.js';

const logger = createLogger('NFOService');

class NFOService {
    constructor() {
        this.exchangeConfig = EXCHANGES.NFO;
    }

    /**
     * Validate NFO token
     */
    validateToken(token) {
        const tokenStr = String(token).trim();
        
        if (!/^\d{1,8}$/.test(tokenStr)) {
            logger.warn(`Invalid NFO token format: ${token}`);
            return false;
        }
        
        return true;
    }

    /**
     * Validate instrument type for NFO
     */
    validateInstrumentType(instrumentType) {
        return isFutures(instrumentType) || isOptions(instrumentType);
    }

    /**
     * Get exchange info
     */
    getExchangeInfo() {
        return {
            ...this.exchangeConfig,
            marketHours: {
                trading: '09:15-15:30'
            },
            supportedInstruments: ['FUTSTK', 'OPTSTK', 'FUTIDX', 'OPTIDX'],
            timezone: 'Asia/Kolkata'
        };
    }
}

export default NFOService;
