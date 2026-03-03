import mongoose from 'mongoose';

const watchlistSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    stocks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instrument',
    }],
}, {
    timestamps: true,
});

// Ensure a user cannot have two watchlists with the same name
watchlistSchema.index({ user: 1, name: 1 }, { unique: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;
