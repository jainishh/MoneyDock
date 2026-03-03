import mongoose from 'mongoose';

const optionChainCacheSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    expirydate: {
        type: String,
        required: true,
        index: true
    },
    data: {
        type: Array,
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for fast lookups
optionChainCacheSchema.index({ name: 1, expirydate: 1 }, { unique: true });

// Auto-expire old cache entries after 7 days
optionChainCacheSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

export default mongoose.model('OptionChainCache', optionChainCacheSchema);
