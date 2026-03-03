import express from 'express';
import {
    addToWatchlist,
    getAllWatchlists,
    getWatchlistByName,
    removeFromWatchlist,
    createWatchlist,
    deleteWatchlist,
    renameWatchlist,
    addByToken,
    removeByToken
} from '../controllers/watchlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/getAllWatchlists').get(protect, getAllWatchlists);
router.route('/createWatchlist').post(protect, createWatchlist);
router.route('/addToWatchlist').post(protect, addToWatchlist);
router.route('/addByToken').post(protect, addByToken);
router.route('/removeByToken').post(protect, removeByToken);
router.route('/removeFromWatchlist/:stockId').delete(protect, removeFromWatchlist);
router.route('/deleteWatchlist/:id').delete(protect, deleteWatchlist);
router.route('/renameWatchlist/:id').put(protect, renameWatchlist);
// IMPORTANT: /:name must be LAST — it's a wildcard and would match everything above
router.route('/:name').get(protect, getWatchlistByName);

export default router;
