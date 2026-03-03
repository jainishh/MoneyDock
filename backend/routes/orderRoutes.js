import express from 'express';
import { placeOrder, getOrderHistory, cancelOrder, modifyOrder } from '../controllers/orderController.js';

const router = express.Router();

/**
 * @route   POST /api/order/placeOrder
 * @desc    Place a new order on Angel One
 * @access  Private (Needs Auth Middleware in future)
 */
router.post('/placeOrder', placeOrder);

/**
 * @route   GET /api/order/history
 * @desc    Get order history for current user
 * @access  Private
 */
router.get('/history', getOrderHistory);

/**
 * @route   POST /api/order/cancel
 * @desc    Cancel an open order
 * @access  Private
 */
router.post('/cancel', cancelOrder);

/**
 * @route   POST /api/order/modify
 * @desc    Modify an open order
 * @access  Private
 */
router.post('/modify', modifyOrder);

export default router;
