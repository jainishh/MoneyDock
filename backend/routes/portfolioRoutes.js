import express from 'express';
import { getHoldings, getPortfolioSummary } from '../controllers/portfolioController.js';

const router = express.Router();

/**
 * @route   GET /api/portfolio/holdings
 * @desc    Get portfolio holdings derived from completed orders
 * @access  Private
 * @query   ?userId=<id>
 */
router.get('/holdings', getHoldings);

/**
 * @route   GET /api/portfolio/summary
 * @desc    Get lightweight portfolio summary stats
 * @access  Private
 * @query   ?userId=<id>
 */
router.get('/summary', getPortfolioSummary);

export default router;
