import { smartApi } from '../config/angelConfig.js';
import { createRequire } from 'module';
import AngelOneCredential from '../models/AngelOneCredential.js';
import Instrument from '../models/Instrument.js';

const require = createRequire(import.meta.url);

// ==================== TOTP HELPER FUNCTIONS ====================

// Helper function for Base32 decoding
const base32Decode = (encoded) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = 0;
    let value = 0;
    let output = [];

    for (let i = 0; i < encoded.length; i++) {
        const char = encoded[i].toUpperCase();
        const index = alphabet.indexOf(char);
        if (index === -1) continue;

        value = (value << 5) | index;
        bits += 5;

        if (bits >= 8) {
            output.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return Buffer.from(output);
};

// Generate TOTP token
const generateTOTP = (secret) => {
    const key = base32Decode(secret);
    const epoch = Math.floor(Date.now() / 1000);
    const timeStep = 30;
    const counter = Math.floor(epoch / timeStep);

    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(counter), 0);

    const hmac = require('node:crypto').createHmac('sha1', key);
    hmac.update(buffer);
    const digest = hmac.digest();

    const offset = digest[digest.length - 1] & 0xf;
    const binary =
        ((digest[offset] & 0x7f) << 24) |
        ((digest[offset + 1] & 0xff) << 16) |
        ((digest[offset + 2] & 0xff) << 8) |
        (digest[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
};

// ==================== CORE LOGIN LOGIC ====================

/**
 * Internal function to perform Angel One login
 * Used by both manual login endpoint and auto-login
 */
const performAngelLogin = async () => {
    let credentialDoc = await AngelOneCredential.findOne();

    // Fallback to env variables if not found in DB
    if (!credentialDoc || !credentialDoc.angel_totp_key) {
        console.log("No valid Angel Credential in DB. Checking .env...");

        if (credentialDoc) {
            await AngelOneCredential.deleteOne({ _id: credentialDoc._id });
        }

        const { ANGEL_CLIENT_ID, ANGEL_PASSWORD, ANGEL_TOTP_KEY, ANGEL_API_KEY } = process.env;

        if (!ANGEL_CLIENT_ID || !ANGEL_PASSWORD || !ANGEL_TOTP_KEY || !ANGEL_API_KEY) {
            throw new Error('Angel One credentials not found in DB or ENV');
        }

        credentialDoc = new AngelOneCredential({
            angel_client_id: ANGEL_CLIENT_ID,
            angel_password: ANGEL_PASSWORD,
            angel_totp_key: ANGEL_TOTP_KEY,
            angel_api_key: ANGEL_API_KEY
        });
    }

    const clientCode = credentialDoc.angel_client_id;
    const pass = credentialDoc.angel_password;
    const totpKey = credentialDoc.angel_totp_key;

    // Validate TOTP key
    if (!totpKey || totpKey.length < 10) {
        throw new Error("Invalid TOTP Key length");
    }

    // Generate TOTP
    const totpToken = generateTOTP(totpKey);
    console.log("TOTP Generated:", totpToken);

    // Perform Login
    const data = await smartApi.generateSession(clientCode, pass, totpToken);

    if (data.status) {
        // Save tokens to DB
        credentialDoc.feedToken = data.data.feedToken;
        credentialDoc.jwtToken = data.data.jwtToken;
        credentialDoc.refreshToken = data.data.refreshToken;
        credentialDoc.token_expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await credentialDoc.save();

        console.log("✅ Login successful! Tokens saved to DB");

        return {
            status: true,
            feedToken: data.data.feedToken,
            jwtToken: data.data.jwtToken,
            refreshToken: data.data.refreshToken,
            clientCode: clientCode,
            apiKey: credentialDoc.angel_api_key
        };
    } else {
        throw new Error(data.message || 'Login failed');
    }
};

// ==================== PUBLIC ENDPOINTS ====================

/**
 * Manual login endpoint (for user-triggered login)
 * POST /api/angel/login
 */
export const loginAngelOne = async (req, res) => {
    try {
        const result = await performAngelLogin();

        return res.status(200).json({
            status: true,
            message: "Login Successful",
            feedToken: result.feedToken,
            jwtToken: result.jwtToken,
            refreshToken: result.refreshToken,
            clientCode: result.clientCode
        });

    } catch (error) {
        console.error("❌ Angel Login Error:", error);
        res.status(500).json({
            status: false,
            message: error.message || "Login failed"
        });
    }
};

/**
 * Auto-login function (for cron jobs)
 * Can be called programmatically
 */
export const autoLoginAngelOne = async () => {
    try {
        console.log('🔄 Auto login started...');
        const result = await performAngelLogin();
        console.log('✅ Auto login successful!');
        return result;
    } catch (error) {
        console.error('❌ Auto login error:', error);
        return {
            status: false,
            message: error.message
        };
    }
};

/**
 * Get stored tokens from DB
 * GET /api/angel/tokens
 */
export const getStoredTokens = async (req, res) => {
    try {
        const credentialDoc = await AngelOneCredential.findOne();

        if (!credentialDoc || !credentialDoc.feedToken) {
            return res.status(404).json({
                status: false,
                message: 'No tokens found in DB. Please login first.'
            });
        }

        // Check if tokens are expired
        const now = new Date();
        const expiry = credentialDoc.token_expiry || new Date(0);

        if (expiry < now) {
            return res.status(401).json({
                status: false,
                message: 'Tokens expired. Please refresh.',
                expired: true
            });
        }

        return res.status(200).json({
            status: true,
            feedToken: credentialDoc.feedToken,
            jwtToken: credentialDoc.jwtToken,
            refreshToken: credentialDoc.refreshToken,
            clientCode: credentialDoc.angel_client_id,
            apiKey: credentialDoc.angel_api_key,
            expiresAt: credentialDoc.token_expiry
        });

    } catch (error) {
        console.error('Get Tokens Error:', error);
        return res.status(500).json({
            status: false,
            message: 'Error fetching tokens',
            error: error.message
        });
    }
};

/**
 * Get session credentials for WebSocket (internal use)
 * Returns credentials object for WebSocket initialization
 */
export const getSessionCredentials = async () => {
    try {
        const credentialDoc = await AngelOneCredential.findOne();

        if (!credentialDoc || !credentialDoc.feedToken) {
            // Auto-login if no tokens found
            const loginResult = await performAngelLogin();
            return loginResult;
        }

        // Check if tokens are expired
        const now = new Date();
        const expiry = credentialDoc.token_expiry || new Date(0);

        if (expiry < now) {
            // Auto-login if tokens expired
            const loginResult = await performAngelLogin();
            return loginResult;
        }

        return {
            status: true,
            feedToken: credentialDoc.feedToken,
            jwtToken: credentialDoc.jwtToken,
            refreshToken: credentialDoc.refreshToken,
            clientCode: credentialDoc.angel_client_id,
            apiKey: credentialDoc.angel_api_key
        };

    } catch (error) {
        console.error('Get Session Credentials Error:', error);
        throw error;
    }
};

// ==================== REST API ENDPOINTS ====================

/**
 * Get market status
 */
export const getMarketStatus = async (req, res) => {
    try {
        const { getMarketStatus: getStatus } = await import('../utils/marketHours.js');
        const status = getStatus();

        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('Error fetching market status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch market status',
            error: error.message
        });
    }
};

/**
 * Get stock quotes via REST API
 */
export const getStockQuotes = async (req, res) => {
    try {
        const { tokens } = req.body;

        if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid tokens array'
            });
        }

        // Get credentials
        const credentials = await getSessionCredentials();

        // Initialize/Update REST API with fresh credentials
        const restAPI = (await import('../services/angelOneRestAPI.js')).default;
        await restAPI.initialize(credentials);

        // Fetch quotes
        const quotes = await restAPI.getQuotes(tokens);

        res.json({
            success: true,
            data: quotes,
            count: quotes.length
        });

    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quotes',
            error: error.message
        });
    }
};

/**
 * Get market depth for a single instrument
 */
export const getMarketDepth = async (req, res) => {
    try {
        const { token, exch_seg } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }

        const exchange = exch_seg || 'NSE';

        // Get credentials
        const credentials = await getSessionCredentials();

        // Initialize/Update REST API with fresh credentials
        const restAPI = (await import('../services/angelOneRestAPI.js')).default;
        await restAPI.initialize(credentials);

        // Fetch market depth
        const depthData = await restAPI.getMarketDepth(token, exchange);

        if (!depthData) {
            return res.status(404).json({
                success: false,
                message: 'Market depth data not found for this token'
            });
        }

        res.json({
            success: true,
            data: depthData
        });

    } catch (error) {
        console.error('Error fetching market depth:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch market depth',
            error: error.message
        });
    }
};

/**
 * Search instruments by name or symbol
 * GET /api/angel/search
 */
export const searchInstruments = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Query must be at least 2 characters'
            });
        }

        // Case insensitive search
        const regex = new RegExp(query, 'i');

        const instruments = await Instrument.find({
            $or: [
                { name: regex },
                { symbol: regex }
            ]
        })
            .select('name symbol token exch_seg instrumenttype expiry')
            .limit(100);

        // Sort locally to ensure EQ and FUT come before OPT, and try to bring variety
        const sortedInstruments = instruments.sort((a, b) => {
            const getRank = (type) => {
                if (type === 'EQ') return 1;
                if (type === 'FUTSTK' || type === 'FUTIDX') return 2;
                if (type === 'OPTSTK' || type === 'OPTIDX') return 3;
                return 4;
            };

            const rankA = getRank(a.instrumenttype);
            const rankB = getRank(b.instrumenttype);

            if (rankA !== rankB) return rankA - rankB;

            // If both are options, sort them by Expiry and then Strike string length as rough proxy
            if (a.expiry && b.expiry) {
                // E.g. 24FEB2026 -> Date parsing. To keep it fast, just locale compare.
                return a.symbol.localeCompare(b.symbol);
            }
            return 0;
        });

        res.json({
            success: true,
            data: sortedInstruments
        });

    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};
