/**
 * Parser for Angel One WebSocket tick data
 * Handles binary data parsing and stock price updates
 */

/**
 * Parse binary tick data from Angel One WebSocket
 * @param {ArrayBuffer|Uint8Array|string|Object} tickData - Data from WebSocket
 * @returns {Object|null} - Parsed tick object or null if invalid
 */
export function parseTickData(tickData) {
    try {
        if (!tickData) return null;

        // Handle object format (Angel One sends parsed data as objects)
        if (typeof tickData === 'object' && !ArrayBuffer.isView(tickData) && !(tickData instanceof ArrayBuffer)) {
            // Check if it has the expected properties from Angel One
            if (tickData.content && typeof tickData.content === 'object') {
                const data = tickData.content;

                // Remove quotes from token if present and convert to string
                const token = data.token ? String(data.token).replace(/"/g, '') : null;

                if (!token) {
                    console.warn('No token in tick data');
                    return null;
                }

                // Angel One prices are in paise (100x), need to divide by 100
                const parsed = {
                    token: token,
                    ltp: (parseFloat(data.last_traded_price) || 0) / 100,
                    open: (parseFloat(data.open_price_day) || 0) / 100,
                    high: (parseFloat(data.high_price_day) || 0) / 100,
                    low: (parseFloat(data.low_price_day) || 0) / 100,
                    close: (parseFloat(data.close_price) || 0) / 100,
                    volume: parseInt(data.vol_traded) || 0,
                    oi: parseInt(data.open_interest) || 0,
                    oiChange: parseInt(data.change_in_open_interest) || 0,
                    timestamp: Date.now()
                };

                console.log('✅ Parsed tick data (object format):', parsed);
                return parsed;
            }

            // Direct object format (without content wrapper)
            if (tickData.token || tickData.last_traded_price) {
                const token = tickData.token ? String(tickData.token).replace(/"/g, '') : null;

                if (!token) {
                    console.warn('No token in direct tick data');
                    return null;
                }

                const parsed = {
                    token: token,
                    ltp: (parseFloat(tickData.last_traded_price) || 0) / 100,
                    open: (parseFloat(tickData.open_price_day) || 0) / 100,
                    high: (parseFloat(tickData.high_price_day) || 0) / 100,
                    low: (parseFloat(tickData.low_price_day) || 0) / 100,
                    close: (parseFloat(tickData.close_price) || 0) / 100,
                    volume: parseInt(tickData.vol_traded) || 0,
                    oi: parseInt(tickData.open_interest) || 0,
                    oiChange: parseInt(tickData.change_in_open_interest) || 0,
                    timestamp: Date.now()
                };

                console.log('✅ Parsed tick data (direct object):', parsed);
                return parsed;
            }
        }

        // Handle binary format (original implementation)
        // Angel One sends data in binary format
        // The data structure depends on the mode (LTP, Quote, Snap Quote)
        // For mode 2 (QUOTE), the structure is:
        // Token: 4 bytes
        // LTP: 4 bytes
        // Open: 4 bytes
        // High: 4 bytes
        // Low: 4 bytes
        // Close: 4 bytes
        // Volume: 8 bytes

        // Convert to ArrayBuffer if needed
        let arrayBuffer;

        if (typeof tickData === 'string') {
            // If it's a string, convert to bytes
            const encoder = new TextEncoder();
            const uint8Array = encoder.encode(tickData);
            arrayBuffer = uint8Array.buffer;
            console.log('Converted string to ArrayBuffer:', uint8Array);
        } else if (tickData instanceof ArrayBuffer) {
            arrayBuffer = tickData;
        } else if (tickData instanceof Uint8Array) {
            arrayBuffer = tickData.buffer;
        } else if (Array.isArray(tickData)) {
            // If it's an array of numbers, convert to Uint8Array
            arrayBuffer = new Uint8Array(tickData).buffer;
        } else {
            console.warn('Unknown tick data format:', typeof tickData);
            return null;
        }

        if (arrayBuffer.byteLength < 32) {
            console.warn('Tick data too short:', arrayBuffer.byteLength, 'bytes. Expected at least 32 bytes.');
            // Try to parse what we have
            if (arrayBuffer.byteLength >= 8) {
                const view = new DataView(arrayBuffer);
                const token = view.getUint32(0, false);
                const ltp = arrayBuffer.byteLength >= 8 ? view.getUint32(4, false) / 100 : 0;

                console.log('Partial parse:', { token, ltp });

                return {
                    token: token.toString(),
                    ltp,
                    open: ltp,
                    high: ltp,
                    low: ltp,
                    close: ltp,
                    volume: 0,
                    timestamp: Date.now()
                };
            }
            return null;
        }

        // Use DataView for reading binary data (browser-compatible)
        const view = new DataView(arrayBuffer);

        // Parse the binary data (Big Endian)
        const token = view.getUint32(0, false); // false = big endian
        const ltp = view.getUint32(4, false) / 100; // Angel One sends price * 100
        const open = view.getUint32(8, false) / 100;
        const high = view.getUint32(12, false) / 100;
        const low = view.getUint32(16, false) / 100;
        const close = view.getUint32(20, false) / 100;
        const volume = view.getBigUint64(24, false);

        const parsed = {
            token: token.toString(),
            ltp,
            open,
            high,
            low,
            close,
            volume: Number(volume),
            timestamp: Date.now()
        };

        console.log('✅ Parsed tick data (binary format):', parsed);

        return parsed;
    } catch (error) {
        console.error('Error parsing tick data:', error);
        return null;
    }
}

/**
 * Update stock price in the stocks array
 * @param {Array} prevStocks - Previous stocks array
 * @param {Object} parsedTick - Parsed tick data
 * @returns {Array} - Updated stocks array
 */
/**
 * Update stock price in the stocks array
 * @param {Array} prevStocks - Previous stocks array
 * @param {Object} parsedTick - Parsed tick data
 * @returns {Array} - Updated stocks array
 */
export function updateStockPrice(prevStocks, parsedTick) {
    if (!parsedTick || !parsedTick.token) {
        return prevStocks;
    }
    // Reuse the bulk update logic for single tick
    return updateStocksWithTicks(prevStocks, [parsedTick]);
}

/**
 * Update multiple stocks with an array of ticks
 * @param {Array} prevStocks - Previous stocks array
 * @param {Array} ticks - Array of parsed tick objects
 * @returns {Array} - Updated stocks array
 */
export function updateStocksWithTicks(prevStocks, ticks) {
    if (!ticks || ticks.length === 0) return prevStocks;

    // Create a map of latest ticks by token for O(1) lookup
    const tickMap = new Map();
    ticks.forEach(tick => {
        if (tick && tick.token) {
            tickMap.set(String(tick.token), tick);
        }
    });

    if (tickMap.size === 0) return prevStocks;

    return prevStocks.map(stock => {
        const tokenKey = String(stock.token || stock.symboltoken);
        const parsedTick = tickMap.get(tokenKey);

        if (parsedTick) {
            const currentPrice = parsedTick.ltp;

            // For first update, use the tick's latest close price if available, otherwise fallback to current LTP
            const baselineClose = stock.close || parsedTick.close || currentPrice;

            // Calculate change from baseline close price
            const change = currentPrice - baselineClose;
            const changePercent = baselineClose && baselineClose > 0
                ? ((change / baselineClose) * 100)
                : 0;

            return {
                ...stock,
                price: currentPrice,
                ltp: currentPrice,
                open: parsedTick.open || stock.open || currentPrice,
                high: parsedTick.high || stock.high || currentPrice,
                low: parsedTick.low || stock.low || currentPrice,
                close: stock.close || parsedTick.close || currentPrice, // Set baseline on first update
                volume: parsedTick.volume || stock.volume || 0,
                oi: parsedTick.oi || stock.oi || 0,
                oiChange: parsedTick.oiChange !== undefined ? parsedTick.oiChange : (stock.oiChange || 0),
                change,
                changePercent: parseFloat(changePercent.toFixed(2)),
                percent: `${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
                isUp: change >= 0,
                lastUpdated: parsedTick.timestamp || Date.now()
            };
        }
        return stock;
    });
}

/**
 * Format price for display
 * @param {number} price - Price value
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted price
 */
export function formatPrice(price, decimals = 2) {
    if (price === null || price === undefined) return '-';
    return price.toFixed(decimals);
}

/**
 * Get price change indicator (up/down/neutral)
 * @param {number} change - Price change value
 * @returns {string} - 'up', 'down', or 'neutral'
 */
export function getPriceChangeIndicator(change) {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
}
