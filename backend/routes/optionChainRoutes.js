import express from 'express';
import { getOptionGreeks, getExpiries, getCustomExpiries, getCustomOptionChain } from '../controllers/optionChainController.js';

const router = express.Router();

// Get valid expiry dates
router.get('/expiries', getExpiries);

// Get custom expiries from DB
router.get('/custom/expiries/:name', getCustomExpiries);

/**
 * @route   POST /api/option-chain/greeks
 * @desc    Get option Greeks data from Angel One API
 * @access  Private
 * @body    { name: "NIFTY", expirydate: "25JAN2024" }
 */
router.post('/greeks', getOptionGreeks);

/**
 * @route   POST /api/option-chain/custom/chain
 * @desc    Get custom option chain built from local Instrument DB
 * @access  Public
 * @body    { name: "RELIANCE", expirydate: "25JAN2024" }
 */
router.post('/custom/chain', getCustomOptionChain);

export default router;
