/**
 * Exchange Type Enums
 * As per Angel One API documentation
 */

export const EXCHANGE_TYPES = {
    NSE_CM: 1,      // NSE Cash Market (Equity)
    NSE_FO: 2,      // NSE Futures & Options (NFO)
    BSE_CM: 3,      // BSE Cash Market
    BSE_FO: 4,      // BSE Futures & Options
    MCX_FO: 5,      // MCX Commodity
    NCX_FO: 7,      // NCX Commodity
    CDS_FO: 13      // Currency Derivatives
};

export const EXCHANGE_TYPE_NAMES = {
    1: 'NSE Cash Market',
    2: 'NSE Futures & Options',
    3: 'BSE Cash Market',
    4: 'BSE Futures & Options',
    5: 'MCX Commodity',
    7: 'NCX Commodity',
    13: 'Currency Derivatives'
};

export default EXCHANGE_TYPES;
