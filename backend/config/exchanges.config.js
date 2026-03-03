/**
 * Exchange Configuration for Angel One WebSocket
 * Defines all supported exchanges with their IDs and default modes
 */

export const EXCHANGES = {
    NSE: {
        code: 'nse_cm',
        typeId: 1,
        name: 'NSE Cash Market',
        description: 'National Stock Exchange - Cash/Equity',
        defaultMode: 2
    },
    NFO: {
        code: 'nse_fo',
        typeId: 2,
        name: 'NSE Futures & Options',
        description: 'NSE F&O Derivatives',
        defaultMode: 2
    },
    BSE: {
        code: 'bse_cm',
        typeId: 3,
        name: 'BSE Cash Market',
        description: 'Bombay Stock Exchange - Cash',
        defaultMode: 2
    },
    BSE_FO: {
        code: 'bse_fo',
        typeId: 4,
        name: 'BSE Futures & Options',
        description: 'BSE F&O Derivatives',
        defaultMode: 2
    },
    MCX: {
        code: 'mcx_fo',
        typeId: 5,
        name: 'MCX Commodity',
        description: 'Multi Commodity Exchange',
        defaultMode: 2
    },
    NCX: {
        code: 'ncx_fo',
        typeId: 7,
        name: 'NCX Commodity',
        description: 'National Commodity Exchange',
        defaultMode: 2
    },
    CDS: {
        code: 'cds_fo',
        typeId: 13,
        name: 'Currency Derivatives',
        description: 'Currency Derivatives Segment',
        defaultMode: 2
    }
};

/**
 * Get exchange config by exchange segment (e.g., 'NSE', 'NFO', 'BSE')
 */
export function getExchangeConfig(exchSeg) {
    if (!exchSeg) return null;
    
    const normalizedSeg = exchSeg.toUpperCase().trim();
    
    // Direct match
    if (EXCHANGES[normalizedSeg]) {
        return EXCHANGES[normalizedSeg];
    }
    
    // Handle common variations
    const variations = {
        'NSE_CM': 'NSE',
        'NSE_FO': 'NFO',
        'BSE_CM': 'BSE',
        'BSE_FO': 'BSE_FO',
        'MCX_FO': 'MCX',
        'NCX_FO': 'NCX',
        'CDS_FO': 'CDS'
    };
    
    if (variations[normalizedSeg]) {
        return EXCHANGES[variations[normalizedSeg]];
    }
    
    return null;
}

/**
 * Get exchange type ID from exchange segment
 */
export function getExchangeTypeId(exchSeg) {
    const config = getExchangeConfig(exchSeg);
    return config ? config.typeId : null;
}

/**
 * Validate if exchange is supported
 */
export function isExchangeSupported(exchSeg) {
    return getExchangeConfig(exchSeg) !== null;
}
