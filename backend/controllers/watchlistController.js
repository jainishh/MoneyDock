import Watchlist from '../models/Watchlist.js';
import Instrument from '../models/Instrument.js';

// Create a new named watchlist
export const createWatchlist = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;

        const existing = await Watchlist.findOne({ user: userId, name });
        if (existing) {
            return res.status(400).json({ message: 'Watchlist with this name already exists' });
        }

        const watchlist = await Watchlist.create({ user: userId, name, stocks: [] });
        res.status(201).json(watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all watchlists (names and ids mainly, full objects populated)
export const getAllWatchlists = async (req, res) => {
    try {
        const userId = req.user._id;
        const watchlists = await Watchlist.find({ user: userId }).populate('stocks'); 
        res.status(200).json(watchlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get specific watchlist by name
export const getWatchlistByName = async (req, res) => {
    try {
        const { name } = req.params;
        const userId = req.user._id;

        const watchlist = await Watchlist.findOne({ user: userId, name }).populate('stocks');

        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        res.status(200).json(watchlist.stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addToWatchlist = async (req, res) => {
    try {
        const { stockId, watchlistId, watchlistName } = req.body; // Support ID or Name
        const userId = req.user._id;

        let query = { user: userId };
        if (watchlistId) query._id = watchlistId;
        else if (watchlistName) query.name = watchlistName;
        else {
            // Default logic: Find "mywatchlist" or create it if strict legacy mode, 
            // but effectively we need a target.
            // If nothing provided, maybe find the first one?
            const first = await Watchlist.findOne({ user: userId });
            if (first) {
                query._id = first._id;
            } else {
                // Create default
                const newDefault = await Watchlist.create({ user: userId, name: 'mywatchlist', stocks: [stockId] });
                return res.status(201).json(newDefault);
            }
        }

        const watchlist = await Watchlist.findOne(query);

        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        if (watchlist.stocks.includes(stockId)) {
            return res.status(400).json({ message: 'Stock already in watchlist' });
        }

        watchlist.stocks.unshift(stockId);
        await watchlist.save();

        res.status(201).json(watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add to watchlist by instrument token (used by option chain / quick-add)
export const addByToken = async (req, res) => {
    try {
        const { token, watchlistName } = req.body;
        const userId = req.user._id;

        if (!token) {
            return res.status(400).json({ success: false, message: 'token is required' });
        }

        // Find the Instrument document for this token
        const instrument = await Instrument.findOne({ token: String(token) });
        if (!instrument) {
            return res.status(404).json({ success: false, message: `Instrument not found for token: ${token}` });
        }

        // Find the target watchlist (by name, or user's first watchlist)
        let watchlist;
        if (watchlistName) {
            watchlist = await Watchlist.findOne({ user: userId, name: watchlistName });
        }
        if (!watchlist) {
            watchlist = await Watchlist.findOne({ user: userId });
        }
        if (!watchlist) {
            // Create a default watchlist if user has none
            watchlist = await Watchlist.create({ user: userId, name: 'Default Watchlist', stocks: [] });
        }

        const stockId = instrument._id;

        if (watchlist.stocks.some(id => id.toString() === stockId.toString())) {
            return res.status(200).json({ success: false, message: 'Already in watchlist' });
        }

        watchlist.stocks.unshift(stockId);
        await watchlist.save();

        return res.status(201).json({ success: true, message: `${instrument.symbol} added to ${watchlist.name}` });
    } catch (error) {
        console.error('addByToken error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove from watchlist by instrument token
export const removeByToken = async (req, res) => {
    try {
        const { token, watchlistName } = req.body;
        const userId = req.user._id;

        if (!token) {
            return res.status(400).json({ success: false, message: 'token is required' });
        }

        // Find the Instrument document for this token
        const instrument = await Instrument.findOne({ token: String(token) });
        if (!instrument) {
            return res.status(404).json({ success: false, message: `Instrument not found for token: ${token}` });
        }

        const stockId = instrument._id;
        
        // Target a specific watchlist or remove from all
        let query = { user: userId };
        if (watchlistName) {
            query.name = watchlistName;
            
            const watchlist = await Watchlist.findOne(query);
            if (watchlist) {
                watchlist.stocks = watchlist.stocks.filter((id) => id.toString() !== stockId.toString());
                await watchlist.save();
                return res.status(200).json({ success: true, message: `${instrument.symbol} removed from ${watchlist.name}` });
            }
        } else {
            // Remove from all watchlists of this user containing the stock
            await Watchlist.updateMany(
                { user: userId, stocks: stockId },
                { $pull: { stocks: stockId } }
            );
            return res.status(200).json({ success: true, message: `${instrument.symbol} removed from all watchlists` });
        }

        return res.status(404).json({ success: false, message: 'Watchlist not found' });
    } catch (error) {
        console.error('removeByToken error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeFromWatchlist = async (req, res) => {
    try {
        const { stockId } = req.params;
        const { watchlistId, watchlistName } = req.query; // Expect query params for DELETE
        const userId = req.user._id;

        let query = { user: userId };
        if (watchlistId) query._id = watchlistId;
        else if (watchlistName) query.name = watchlistName;
        else {
            // If no watchlist specified, remove from ALL? Or just first?
            // Safest: Remove from all watchlists of this user containing the stock
            await Watchlist.updateMany(
                { user: userId, stocks: stockId },
                { $pull: { stocks: stockId } }
            );
            // Return updated state of "active" or just success?
            // Let's return success message or updated first list.
            return res.status(200).json({ message: 'Removed from all lists' });
        }

        const watchlist = await Watchlist.findOne(query);

        if (watchlist) {
            watchlist.stocks = watchlist.stocks.filter((id) => id.toString() !== stockId);
            await watchlist.save();
            const updated = await Watchlist.findOne(query).populate('stocks');
            return res.status(200).json(updated.stocks);
        }

        res.status(404).json({ message: 'Watchlist not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a watchlist by ID
export const deleteWatchlist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const watchlist = await Watchlist.findOneAndDelete({ _id: id, user: userId });

        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        res.status(200).json({ message: 'Watchlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Rename a watchlist
export const renameWatchlist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user._id;

        // Check if new name already exists
        const existing = await Watchlist.findOne({ user: userId, name });
        if (existing && existing._id.toString() !== id) {
            return res.status(400).json({ message: 'Watchlist with this name already exists' });
        }

        const watchlist = await Watchlist.findOneAndUpdate(
            { _id: id, user: userId },
            { name },
            { new: true }
        );

        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        res.status(200).json(watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
