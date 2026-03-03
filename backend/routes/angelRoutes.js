import express from 'express';
import {
    getMarketStatus,
    getStockQuotes,
    searchInstruments,
    loginAngelOne,
    getStoredTokens,
    getMarketDepth
} from '../controllers/angelController.js';

const router = express.Router();

// Manual login endpoint
router.post('/login', loginAngelOne);

// Get cached tokens from DB
router.get('/tokens', getStoredTokens);

// Market status endpoint
router.get('/market-status', getMarketStatus);

// Get stock quotes (REST API fallback)
router.post('/quotes', getStockQuotes);

// Search instruments
router.get('/search', searchInstruments);

// Get Market Depth
router.post('/market-depth', getMarketDepth);

export default router;

