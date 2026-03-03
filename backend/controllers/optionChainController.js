import { getSessionCredentials } from './angelController.js';
import { createLogger } from '../utils/logger.js';
import OptionChainCache from '../models/OptionChainCache.js';

const logger = createLogger('OptionChain');

// ── In-memory cache to avoid hitting API rate limits ──────────────────────────
const greeksCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function getCacheKey(name, expirydate) {
    return `${name}:${expirydate}`;
}

function getCached(name, expirydate) {
    const key = getCacheKey(name, expirydate);
    const entry = greeksCache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
        logger.info(`Memory cache HIT for ${key}`);
        return entry.data;
    }
    if (entry) greeksCache.delete(key); // expired
    return null;
}

function setCache(name, expirydate, data) {
    const key = getCacheKey(name, expirydate);
    greeksCache.set(key, { data, timestamp: Date.now() });
    if (greeksCache.size > 50) {
        const oldest = greeksCache.keys().next().value;
        greeksCache.delete(oldest);
    }
}

// ── Save to MongoDB for persistent caching ────────────────────────────────────
async function saveToDb(name, expirydate, optionChain) {
    try {
        await OptionChainCache.findOneAndUpdate(
            { name, expirydate },
            { data: optionChain, count: optionChain.length, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        logger.info(`DB cache saved for ${name}:${expirydate}`);
    } catch (err) {
        logger.warn(`DB cache save failed: ${err.message}`);
    }
}

// ── Get from MongoDB when API has no data ─────────────────────────────────────
async function getFromDb(name, expirydate) {
    try {
        const cached = await OptionChainCache.findOne({ name, expirydate });
        if (cached && cached.data && cached.data.length > 0) {
            logger.info(`DB cache HIT for ${name}:${expirydate} (${cached.data.length} strikes, updated ${cached.updatedAt})`);
            return cached;
        }
    } catch (err) {
        logger.warn(`DB cache read failed: ${err.message}`);
    }
    return null;
}

// ── Retry helper with exponential backoff ─────────────────────────────────────
async function fetchWithRetry(url, options, maxRetries = 3) {
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            const rawText = await response.text();

            if (response.status === 403 && attempt < maxRetries) {
                const delayMs = Math.pow(2, attempt) * 1000;
                logger.warn(`Rate limited (403). Retry ${attempt}/${maxRetries} after ${delayMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
                continue;
            }

            return { response, rawText };
        } catch (err) {
            lastError = err;
            if (attempt < maxRetries) {
                const delayMs = Math.pow(2, attempt) * 1000;
                logger.warn(`Fetch error: ${err.message}. Retry ${attempt}/${maxRetries} after ${delayMs}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }
    throw lastError || new Error('All retry attempts failed');
}

/**
 * Get Option Greeks data from Angel One API
 * POST /api/option-chain/greeks
 * Body: { name: "NIFTY", expirydate: "25JAN2024" }
 */
export const getOptionGreeks = async (req, res) => {
    try {
        const { name, expirydate } = req.body || {};

        if (!name || !expirydate) {
            return res.status(400).json({
                success: false,
                message: 'name and expirydate are required'
            });
        }

        // ── Validate that name is a supported F&O index ───────────────────
        const SUPPORTED_INDICES = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY', 'SENSEX'];
        if (!SUPPORTED_INDICES.includes(name)) {
            logger.warn(`Rejected unsupported index name: "${name}". Must be one of: ${SUPPORTED_INDICES.join(', ')}`);
            return res.status(400).json({
                success: false,
                message: `Option Greeks are only available for indices: ${SUPPORTED_INDICES.join(', ')}. "${name}" is not supported.`
            });
        }

        // ── Check in-memory cache first ───────────────────────────────────
        const memoryCached = getCached(name, expirydate);
        if (memoryCached) {
            return res.status(200).json({
                success: true,
                ...memoryCached,
                fromCache: true
            });
        }

        // ── Get credentials (auto-login if expired) ──────────────────────
        let credentials;
        try {
            credentials = await getSessionCredentials();
        } catch (loginErr) {
            console.error('❌ Login failed:', loginErr.message);
            // If login fails, try DB cache
            const dbCached = await getFromDb(name, expirydate);
            if (dbCached) {
                return res.status(200).json({
                    success: true,
                    data: dbCached.data,
                    name,
                    expiry: expirydate,
                    count: dbCached.count,
                    fromCache: true,
                    cachedAt: dbCached.updatedAt
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Login failed: ' + loginErr.message
            });
        }

        if (!credentials || !credentials.jwtToken) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated. Please login first.'
            });
        }

        logger.info(`Option Greeks Request: ${name} / ${expirydate}`);

        // Updated URL to correct Angel One endpoint
        const apiUrl = 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/marketData/v1/optionGreek';

        const headers = {
            'Authorization': `Bearer ${credentials.jwtToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-UserType': 'USER',
            'X-SourceID': 'WEB',
            'X-ClientLocalIP': '127.0.0.1',
            'X-ClientPublicIP': '127.0.0.1',
            'X-MACAddress': 'MAC_ADDRESS',
            'X-PrivateKey': credentials.apiKey
        };

        const requestBody = JSON.stringify({ name, expirydate });

        let result = null;
        let lastError = null;

        try {
            const { response, rawText } = await fetchWithRetry(apiUrl, {
                method: 'POST',
                headers,
                body: requestBody
            });

            // Enhanced logging for debugging
            console.log(`🔍 [OptionGreeks] Raw Response:`, rawText.substring(0, 1000));
            logger.info(`HTTP ${response.status} | Response length: ${rawText.length}`);

            if (!response.ok) {
                if (response.status === 403) {
                    lastError = 'API rate limit exceeded (403). Please wait and try again.';
                } else {
                    lastError = `HTTP ${response.status}: ${rawText.substring(0, 200)}`;
                }
                result = JSON.parse(rawText);
                if (result.status && result.data && result.data.length > 0) {
                    try { require('fs').writeFileSync('debug_greeks.json', JSON.stringify(result.data[0], null, 2)); } catch(e){}
                    logger.success(`SUCCESS — ${result.data.length} records`);
                } else {
                    lastError = result.message || 'No Data Available from API';
                    if (result.errorcode) {
                        logger.warn(`API Error Code: ${result.errorcode} | Message: ${result.message}`);
                    }
                }
            }
        } catch (fetchErr) {
            console.error(`❌ Fetch error:`, fetchErr.message);
            lastError = fetchErr.message?.includes('403')
                ? 'API rate limit exceeded. Please wait a minute and try again.'
                : fetchErr.message;
        }

        // ── Process successful API response ───────────────────────────────
        if (result && result.status && result.data && result.data.length > 0) {
            const strikeMap = {};
            
            // Try formatting tokens from ScripMaster
            let scripTokens = [];
            try {
                const fs = await import('fs');
                const path = await import('path');
                const scripPath = path.resolve('ScripMaster.json');
                if (fs.existsSync(scripPath)) {
                    const allScrips = JSON.parse(fs.readFileSync(scripPath, 'utf8'));
                    // Filter down to the specific index and expiry to speed up lookup
                    scripTokens = allScrips.filter(s => 
                        (s.exch_seg === 'NFO' || s.exch_seg === 'BFO') && 
                        s.instrumenttype === 'OPTIDX' && 
                        s.name === name && 
                        s.expiry === expirydate
                    );
                }
            } catch (err) {
                logger.warn(`Failed to load ScripMaster for tokens: ${err.message}`);
            }

            result.data.forEach(item => {
                const strike = parseFloat(item.strikePrice);
                if (!strikeMap[strike]) {
                    strikeMap[strike] = { strikePrice: strike, CE: null, PE: null };
                }
                
                // Lookup scrip info for this specific option
                const strikeStr = (strike * 100).toFixed(6); // Angel One Scrip Master precision (e.g. 23000 -> 2300000.000000)
                const scripInfo = scripTokens.find(s => 
                    s.strike === strikeStr && 
                    s.symbol.endsWith(item.optionType)
                );

                const greekData = {
                    delta: parseFloat(item.delta) || 0,
                    gamma: parseFloat(item.gamma) || 0,
                    theta: parseFloat(item.theta) || 0,
                    vega: parseFloat(item.vega) || 0,
                    impliedVolatility: parseFloat(item.impliedVolatility) || 0,
                    tradeVolume: parseFloat(item.tradeVolume) || 0,
                    token: scripInfo ? scripInfo.token : null,
                    symbol: scripInfo ? scripInfo.symbol : null,
                    lotsize: scripInfo ? parseInt(scripInfo.lotsize) : null,
                    exch_seg: scripInfo ? scripInfo.exch_seg : (name === 'SENSEX' ? 'BFO' : 'NFO')
                };

                if (item.optionType === 'CE') {
                    strikeMap[strike].CE = greekData;
                } else if (item.optionType === 'PE') {
                    strikeMap[strike].PE = greekData;
                }
            });

            const optionChain = Object.values(strikeMap).sort(
                (a, b) => a.strikePrice - b.strikePrice
            );

            logger.success(`Option Greeks: ${optionChain.length} strikes for ${name}`);

            const responseData = {
                data: optionChain,
                name,
                expiry: expirydate,
                count: optionChain.length
            };

            // Save to both in-memory and DB cache
            setCache(name, expirydate, responseData);
            saveToDb(name, expirydate, optionChain); // fire-and-forget

            return res.status(200).json({
                success: true,
                ...responseData
            });
        }

        // ── Helper to inject tokens from ScripMaster ──────────────────────────
        const injectTokens = async (chainData) => {
            let scripTokens = [];
            try {
                const fs = await import('fs');
                const path = await import('path');
                const scripPath = path.resolve('ScripMaster.json');
                if (fs.existsSync(scripPath)) {
                    const allScrips = JSON.parse(fs.readFileSync(scripPath, 'utf8'));
                    scripTokens = allScrips.filter(s => 
                        (s.exch_seg === 'NFO' || s.exch_seg === 'BFO') && 
                        s.instrumenttype === 'OPTIDX' && 
                        s.name === name && 
                        s.expiry === expirydate
                    );
                }
            } catch (err) {
                logger.warn(`Failed to load ScripMaster for tokens: ${err.message}`);
            }

            if (scripTokens.length === 0) return chainData;

            return chainData.map(strikeObj => {
                const strikeStr = (parseFloat(strikeObj.strikePrice) * 100).toFixed(6);
                
                const injectToGreek = (greekObj, type) => {
                    if (!greekObj) return null;
                    const scripInfo = scripTokens.find(s => 
                        s.strike === strikeStr && 
                        s.symbol.endsWith(type)
                    );
                    if (scripInfo) {
                        greekObj.token = scripInfo.token;
                        greekObj.symbol = scripInfo.symbol;
                        greekObj.lotsize = parseInt(scripInfo.lotsize);
                        greekObj.exch_seg = scripInfo.exch_seg;
                    }
                    return greekObj;
                };

                return {
                    ...strikeObj,
                    CE: injectToGreek(strikeObj.CE, 'CE'),
                    PE: injectToGreek(strikeObj.PE, 'PE')
                };
            });
        };

        // ── API returned no data — try DB cache (last closing data) ───────
        const dbCached = await getFromDb(name, expirydate);
        if (dbCached) {
            logger.info(`Serving DB cached data for ${name}:${expirydate}`);
            
            // Inject tokens into cached data just in case they were missing
            const enhancedData = await injectTokens(dbCached.data);
            
            return res.status(200).json({
                success: true,
                data: enhancedData,
                name,
                expiry: expirydate,
                count: dbCached.count,
                fromCache: true,
                cachedAt: dbCached.updatedAt
            });
        }

        // ── No API data and no cached data ────────────────────────────────
        return res.status(200).json({
            success: false,
            message: lastError || 'No Data Available',
            debug: {
                sentName: name,
                sentExpiry: expirydate,
                apiStatus: result?.status,
                apiMessage: result?.message,
                apiErrorCode: result?.errorcode
            }
        });

    } catch (error) {
        console.error('💀 Option Greeks Controller Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
};

/**
 * Get accurate, valid Expiries directly from Scrip Master
 * GET /api/option-chain/expiries
 */
export const getExpiries = async (req, res) => {
    try {
        const fs = await import('fs');
        const path = await import('path');
        const expiriesPath = path.resolve('expiries.json');
        
        if (!fs.existsSync(expiriesPath)) {
            return res.status(404).json({ success: false, message: 'Expiries not found' });
        }
        
        const data = fs.readFileSync(expiriesPath, 'utf8');
        return res.status(200).json({
            success: true,
            data: JSON.parse(data)
        });
    } catch (error) {
        logger.warn(`Error reading expiries: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Failed to load expiries' });
    }
};

/**
 * Get accurate, valid Expiries for a specific symbol from the DB
 * GET /api/option-chain/custom/expiries/:name
 */
export const getCustomExpiries = async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Stock/Index name is required' });
        }

        const { default: Instrument } = await import('../models/Instrument.js');
        
        // Find distinct expiries for this name where it's an option
        const expiries = await Instrument.distinct('expiry', {
            name: name,
            instrumenttype: { $in: ['OPTIDX', 'OPTSTK'] }
        });

        if (!expiries || expiries.length === 0) {
            return res.status(404).json({ success: false, message: `No expiries found for ${name}` });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter out expired dates
        const validExpiries = expiries.filter(expiryStr => {
            if (!expiryStr || expiryStr.length < 9) return true;
            const expiryDate = new Date(`${expiryStr.slice(0, 2)} ${expiryStr.slice(2, 5)} ${expiryStr.slice(5)}`);
            return expiryDate >= today;
        });

        // Sort expiries: format is DDMMMYYYY (e.g., 25JAN2024), convert to Date for correct ordering
        const sortedExpiries = validExpiries.sort((a, b) => {
            const dateA = new Date(`${a.slice(0, 2)} ${a.slice(2, 5)} ${a.slice(5)}`);
            const dateB = new Date(`${b.slice(0, 2)} ${b.slice(2, 5)} ${b.slice(5)}`);
            return dateA - dateB;
        });

        return res.status(200).json({
            success: true,
            data: sortedExpiries
        });
    } catch (error) {
        logger.error(`Error fetching custom expiries for ${req.params?.name}:`, error);
        return res.status(500).json({ success: false, message: 'Failed to fetch Custom Expiries' });
    }
};

/**
 * Get Custom Option Chain from the cached local Instruments Database
 * POST /api/option-chain/custom/chain
 * Body: { name: "RELIANCE", expirydate: "25JAN2024" }
 */
export const getCustomOptionChain = async (req, res) => {
    try {
        const { name, expirydate } = req.body || {};

        if (!name || !expirydate) {
            return res.status(400).json({
                success: false,
                message: 'name and expirydate are required'
            });
        }

        const { default: Instrument } = await import('../models/Instrument.js');

        // Allow both OPTIDX and OPTSTK
        const optionsDocs = await Instrument.find({
            name: name,
            expiry: expirydate,
            instrumenttype: { $in: ['OPTIDX', 'OPTSTK'] }
        });

        if (!optionsDocs || optionsDocs.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No option chain available for ${name} expiring on ${expirydate}`
            });
        }

        // Look up underlying token for Live Spot Price tracking in the frontend
        let underlyingToken = null;
        let underlyingExchSeg = null;
        try {
            const underlyingDocs = await Instrument.find({
                name: name,
                instrumenttype: { $in: ['', 'AMXIDX', 'EQ'] },
                exch_seg: { $in: ['NSE', 'BSE'] }
            }).limit(1);
            if (underlyingDocs && underlyingDocs.length > 0) {
                underlyingToken = underlyingDocs[0].token;
                underlyingExchSeg = underlyingDocs[0].exch_seg;
            }
        } catch (e) {
            logger.warn(`Failed to find underlying token for ${name}: ${e.message}`);
        }

        const strikeMap = {};

        optionsDocs.forEach(item => {
            // "strike" in ScripMaster is often formatted "2300000.000000" (implied * 100)
            const strikePrice = parseFloat(item.strike) / 100;

            if (!strikeMap[strikePrice]) {
                strikeMap[strikePrice] = { strikePrice, CE: null, PE: null };
            }

            const isCE = item.symbol.endsWith('CE');
            const isPE = item.symbol.endsWith('PE');
            
            const optionData = {
                delta: null, // Greeks are null because we don't fetch them for custom chain
                gamma: null,
                theta: null,
                vega: null,
                impliedVolatility: null,
                tradeVolume: null,
                token: item.token,
                symbol: item.symbol,
                lotsize: parseInt(item.lotsize) || null,
                exch_seg: item.exch_seg
            };

            if (isCE) {
                strikeMap[strikePrice].CE = optionData;
            } else if (isPE) {
                strikeMap[strikePrice].PE = optionData;
            }
        });

        // Filter out strikes that don't have at least one valid token and sort array
        const optionChain = Object.values(strikeMap)
            .filter(strike => strike.CE?.token || strike.PE?.token)
            .sort((a, b) => a.strikePrice - b.strikePrice);

        logger.success(`Custom Option Chain generated: ${optionChain.length} strikes for ${name}`);

        return res.status(200).json({
            success: true,
            data: optionChain,
            name,
            expiry: expirydate,
            count: optionChain.length,
            isCustom: true, // Flag to tell frontend this is custom data
            underlyingToken,
            underlyingExchSeg
        });

    } catch (error) {
        logger.error('💀 Custom Option Chain Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error: ' + error.message
        });
    }
};

