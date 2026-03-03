/**
 * Instrument Type Constants
 * Types of instruments available across exchanges
 */

export const INSTRUMENT_TYPES = {
    EQUITY: '',           // Equity/Cash stocks
    FUTSTK: 'FUTSTK',    // Futures - Stock
    OPTSTK: 'OPTSTK',    // Options - Stock
    FUTIDX: 'FUTIDX',    // Futures - Index
    OPTIDX: 'OPTIDX',    // Options - Index
    INDEX: 'INDEX',       // Index
    FUTCUR: 'FUTCUR',    // Futures - Currency
    OPTCUR: 'OPTCUR',    // Options - Currency
    FUTCOM: 'FUTCOM',    // Futures - Commodity
    AMXIDX: 'AMXIDX',
    COMDTY: 'COMDTY',
    FUTBAS: 'FUTBAS',
    FUTBLN: 'FUTBLN',
    FUTENR: 'FUTENR',
    FUTIRC: 'FUTIRC',
    FUTIRT: 'FUTIRT',
    OPTBLN: 'OPTBLN',
    OPTFUT: 'OPTFUT',
    OPTIRC: 'OPTIRC',
    UNDCUR: 'UNDCUR',
    UNDIRC: 'UNDIRC',
    UNDIRD: 'UNDIRD',
    UNDIRT: 'UNDIRT'
};

export const INSTRUMENT_CATEGORIES = {
    FUTURES: ['FUTSTK', 'FUTIDX', 'FUTCUR', 'FUTCOM', 'FUTBAS', 'FUTBLN', 'FUTENR', 'FUTIRC', 'FUTIRT'],
    OPTIONS: ['OPTSTK', 'OPTIDX', 'OPTCUR', 'OPTBLN', 'OPTFUT', 'OPTIRC'],
    EQUITY: ['', 'EQUITY'],
    INDEX: ['INDEX', 'AMXIDX'],
    COMMODITY: ['COMDTY', 'FUTCOM'],
    CURRENCY: ['FUTCUR', 'OPTCUR', 'UNDCUR', 'UNDIRC', 'UNDIRD', 'UNDIRT']
};

/**
 * Check if instrument is a futures contract
 */
export function isFutures(instrumentType) {
    return INSTRUMENT_CATEGORIES.FUTURES.includes(instrumentType);
}

/**
 * Check if instrument is an options contract
 */
export function isOptions(instrumentType) {
    return INSTRUMENT_CATEGORIES.OPTIONS.includes(instrumentType);
}

/**
 * Check if instrument is equity
 */
export function isEquity(instrumentType) {
    return INSTRUMENT_CATEGORIES.EQUITY.includes(instrumentType);
}

export default INSTRUMENT_TYPES;
