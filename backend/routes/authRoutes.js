import express from 'express';
const router = express.Router();
import { authUser, registerUser, getUserProfile, updateUserProfile, updateUserBalance } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/signup', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/profile/balance').put(protect, updateUserBalance);

export default router;
