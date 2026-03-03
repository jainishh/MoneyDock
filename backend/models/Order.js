import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    variety: {
        type: String,
        enum: ['NORMAL', 'STOPLOSS', 'AMO', 'ROBO'],
        default: 'NORMAL',
        required: true
    },
    tradingsymbol: {
        type: String,
        required: true
    },
    symboltoken: {
        type: String,
        required: true
    },
    transactiontype: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    exchange: {
        type: String,
        enum: ['NSE', 'BSE', 'NFO', 'MCX'],
        required: true
    },
    ordertype: {
        type: String,
        enum: ['MARKET', 'LIMIT', 'STOPLOSS_LIMIT', 'STOPLOSS_MARKET'],
        required: true
    },
    producttype: {
        type: String,
        enum: ['DELIVERY', 'INTRADAY', 'CARRYFORWARD', 'MARGIN'],
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    marketPriceAtOrder: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        required: true
    },
    squareoff: {
        type: Number,
        default: 0
    },
    stoploss: {
        type: Number,
        default: 0
    },
    trailingstoploss: {
        type: Number,
        default: 0
    },
    triggerprice: {
        type: Number,
        default: 0
    },

    angelOrderId: {
        type: String
    },
    message: {
        type: String
    },
    tag: {
        type: String // Optional tag for tracking
    },
    // --- Execution Details (Angel One Parity) ---
    averagePrice: {
        type: Number,
        default: 0
    },
    filledShares: {
        type: Number,
        default: 0
    },
    unfilledShares: {
        type: Number,
        default: function () { return this.quantity; }
    },
    orderstatus: {
        type: String,
        enum: ['pending', 'open', 'complete', 'rejected', 'cancelled'],
        default: 'pending'
    },
    uniqueorderid: {
        type: String
    },
    updateTime: {
        type: String
    },
    exchtime: {
        type: String
    },
    exchorderupdatetime: {
        type: String
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
