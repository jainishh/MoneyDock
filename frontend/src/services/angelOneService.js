/**
 * Angel One API Service
 * Reusable functions for interacting with Angel One backend
 * With localStorage caching for performance
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CACHE_KEY = 'angel_one_tokens';

/**
 * Check if cached tokens are still valid
 * @param {Object} cachedData 
 * @returns {boolean}
 */
const isTokenValid = (cachedData) => {
    if (!cachedData || !cachedData.expiresAt) return false;
    
    const expiryTime = new Date(cachedData.expiresAt).getTime();
    const now = Date.now();
    
    // Valid if expires in more than 5 minutes
    return expiryTime > (now + 5 * 60 * 1000);
};

/**
 * Get tokens from localStorage cache
 * @returns {Object|null}
 */
const getCachedTokens = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        return isTokenValid(data) ? data : null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
};

/**
 * Save tokens to localStorage
 * @param {Object} tokens 
 */
const setCachedTokens = (tokens) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(tokens));
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
};

/**
 * Clear cached tokens
 */
export const clearCachedTokens = () => {
    localStorage.removeItem(CACHE_KEY);
};

/**
 * Get tokens from backend DB
 * @returns {Promise<Object>}
 */
const getTokensFromDB = async () => {
    const response = await fetch(`${API_BASE_URL}/api/angel/tokens`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (!data.status) {
        throw new Error(data.message || 'Failed to get tokens from DB');
    }

    return {
        feedToken: data.feedToken,
        jwtToken: data.jwtToken,
        refreshToken: data.refreshToken,
        clientCode: data.clientCode,
        apiKey: data.apiKey,
        expiresAt: data.expiresAt
    };
};

/**
 * Login to Angel One and get fresh session tokens
 * @returns {Promise<Object>}
 */
export const loginToAngelOne = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/angel/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        const data = await response.json();

        if (!data.status) {
            throw new Error(data.message || 'Angel One login failed');
        }

        const tokens = {
            status: true,
            feedToken: data.feedToken,
            jwtToken: data.jwtToken,
            refreshToken: data.refreshToken,
            clientCode: data.clientCode,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };

        // Cache the tokens
        setCachedTokens(tokens);

        return tokens;

    } catch (error) {
        console.error('Angel One Login Error:', error);
        throw error;
    }
};

/**
 * Get session credentials with smart caching
 * Priority: localStorage → DB → Fresh Login
 * @returns {Promise<Object>}
 */
export const getSessionCredentials = async () => {
    try {
        // 1. Try localStorage cache first (fastest)
        let tokens = getCachedTokens();
        if (tokens) {
            console.log('✅ Using cached tokens from localStorage');
            return tokens;
        }

        // 2. Try DB if cache miss (faster than login)
        try {
            tokens = await getTokensFromDB();
            console.log('✅ Got tokens from DB');
            setCachedTokens(tokens);
            return tokens;
        } catch (dbError) {
            console.log('⚠️ DB tokens not available, logging in...');
        }

        // 3. Fresh login if both fail
        tokens = await loginToAngelOne();
        console.log('✅ Fresh login successful');
        return tokens;

    } catch (error) {
        console.error('Failed to get session credentials:', error);
        throw error;
    }
};

/**
 * Get feed token only
 * @returns {Promise<string>}
 */
export const getFeedToken = async () => {
    const credentials = await getSessionCredentials();
    return credentials.feedToken;
};

/**
 * Refresh session if needed
 * @param {string} refreshToken 
 * @returns {Promise<any>}
 */
export const refreshSession = async (refreshToken) => {
    try {
        clearCachedTokens(); // Clear old cache
        
        const response = await fetch(`${API_BASE_URL}/api/angel/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();
        
        if (data.status) {
            setCachedTokens(data);
        }

        return data;

    } catch (error) {
        console.error('Session Refresh Error:', error);
        throw error;
    }
};

/**
 * Get market status
 * @returns {Promise<object>}
 */
export const getMarketStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/angel/market-status`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        return data.success ? data.data : null;

    } catch (error) {
        console.error('Market Status Error:', error);
        return null;
    }
};

/**
 * Fetch stock quotes via REST API (fallback when market closed or WebSocket unavailable)
 * @param {array} tokens - Array of stock objects
 * @returns {Promise<array>}
 */
export const fetchStockQuotes = async (tokens) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/angel/quotes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens })
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch quotes');
        }

        console.log(`✅ Fetched ${data.count} quotes via REST API`);
        return data.data;

    } catch (error) {
        console.error('Fetch Quotes Error:', error);
        return [];
    }
};

/**
 * Search instruments by name or symbol
 * @param {string} query
 * @returns {Promise<array>}
 */
export const searchInstrumentsAPI = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/angel/search?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        return data.success ? data.data : [];

    } catch (error) {
        console.error('Search API Error:', error);
        return [];
    }
};

/**
 * Place an order
 * @param {object} orderDetails
 * @returns {Promise<object>}
 */
export const placeOrder = async (orderDetails) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/order/placeOrder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails)
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Place Order Error:', error);
        return { success: false, message: error.message };
    }
};

