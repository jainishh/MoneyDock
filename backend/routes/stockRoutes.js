import express from 'express';
import { getCandleData } from '../controllers/stockController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/candle', protect, getCandleData);

export default router;
