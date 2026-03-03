console.log('--- BACKEND STARTING ---');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import angelRoutes from './routes/angelRoutes.js';
import WebSocketManager from './services/websocket/WebSocketManager.js';
import SubscriptionManager from './services/websocket/SubscriptionManager.js';
import DataStreamHandler from './services/websocket/DataStreamHandler.js';
import { SUBSCRIPTION_MODES } from './constants/subscriptionModes.js';
import watchlistRoute from './routes/watchlistRoutes.js'
import stockRoutes from './routes/stockRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import positionRoutes from './routes/positionRoutes.js';
import optionChainRoutes from './routes/optionChainRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import startAngelLoginCron from './cron/angelLoginCron.js';
import fetchInstruments from './cron/fetchInstrumentsCron.js';
import { createLogger } from './utils/logger.js';

dotenv.config();

import startPendingOrdersCron from './cron/pendingOrdersCron.js';
import startAutoSquareOffCron from './cron/autoSquareOffCron.js';

// Initialize App
const initApp = async () => {
    try {
        await connectDB();

        // Initialize Cron Jobs after DB connection
        startAngelLoginCron();
        fetchInstruments();
        startPendingOrdersCron();
        startAutoSquareOffCron();

        logger.success('Database connected and cron jobs started');
    } catch (err) {
        logger.error('Failed to initialize app', err);
        process.exit(1);
    }
};

initApp();

const logger = createLogger('Main');
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Initialize WebSocket services
const wsManager = new WebSocketManager();
const subManager = new SubscriptionManager(wsManager);
const dataStreamHandler = new DataStreamHandler(io);

// Setup WebSocket event listeners
function setupWebSocketListeners() {
    wsManager.setupEventListeners({
        onTick: (tickData) => dataStreamHandler.handleTickData(tickData),
        onError: (error) => dataStreamHandler.handleError(error),
        onClose: () => dataStreamHandler.handleDisconnect()
    });
    logger.success('WebSocket event listeners configured');
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/angel', angelRoutes);
app.use('/api/watchlist', watchlistRoute);
app.use('/api/stock', stockRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);
app.use('/api/option-chain', optionChainRoutes);
app.use('/api/portfolio', portfolioRoutes);



app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Handle subscription requests from frontend
    socket.on('subscribe_stocks', async (data) => {
        const { tokens, mode = SUBSCRIPTION_MODES.LTP } = data;

        logger.info('Subscription request received:', {
            tokensCount: tokens?.length,
            mode,
            modeDescription: mode === 1 ? 'LTP (Fast)' : mode === 2 ? 'Quote (OHLC)' : 'Snap Quote'
        });

        if (!tokens || !Array.isArray(tokens)) {
            socket.emit('subscription_error', { message: 'Invalid stocks data' });
            return;
        }

        // If not connected to Angel One, attempt connection first
        if (!wsManager.isConnected) {
            try {
                logger.info('Angel One not connected, attempting to connect...');

                // Get credentials from angel controller/service
                const { getSessionCredentials } = await import('./controllers/angelController.js');
                const credentials = await getSessionCredentials();

                logger.debug('Got credentials:', {
                    hasJwtToken: !!credentials.jwtToken,
                    hasFeedToken: !!credentials.feedToken,
                    hasClientCode: !!credentials.clientCode,
                    hasApiKey: !!credentials.apiKey
                });

                await wsManager.connect(credentials);
                setupWebSocketListeners();

                logger.success('Angel One WebSocket connected successfully');
            } catch (error) {
                logger.error('Failed to connect to Angel One:', error);
                socket.emit('subscription_error', {
                    message: 'Failed to connect to market data: ' + error.message
                });
                return;
            }
        }

        // Subscribe to stocks with specified mode
        const result = subManager.subscribeToStocks(tokens, mode);
        socket.emit('subscription_result', result);
    });

    // Handle unsubscribe requests
    socket.on('unsubscribe_stocks', (data) => {
        const { tokens } = data;
        logger.info('Unsubscribe request:', { tokensCount: tokens?.length });

        const result = subManager.unsubscribeFromStocks(tokens);
        socket.emit('unsubscription_result', result);
    });

    // Get subscription status
    socket.on('get_subscriptions', () => {
        const subscriptions = subManager.getSubscriptions();
        socket.emit('subscriptions_status', subscriptions);
    });

    // Get WebSocket status
    socket.on('get_status', () => {
        const wsStatus = wsManager.getStatus();
        const subStatus = subManager.getSubscriptions();
        const streamStats = dataStreamHandler.getStats();

        socket.emit('status', {
            webSocket: wsStatus,
            subscriptions: subStatus,
            stream: streamStats
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    wsManager.disconnect();
    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

// Use httpServer instead of app for listening
httpServer.listen(PORT, () => {
    logger.success(`Server is running on port ${PORT}`);
    logger.success(`Socket.IO server is ready`);
});
