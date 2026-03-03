import express from 'express';
import { getPositions } from '../controllers/positionController.js';

const router = express.Router();

/**
 * @route   GET /api/position/
 * @desc    Get user's positions (derived from completed orders)
 * @access  Private
 */
router.get('/', getPositions);

export default router;
