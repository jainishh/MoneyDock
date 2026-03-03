import restAPI from '../services/angelOneRestAPI.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('StockController');

export const getCandleData = async (req, res) => {
    try {
        const { exchange, symboltoken, interval, fromdate, todate } = req.body;

        if (!symboltoken || !interval || !fromdate || !todate) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        const params = {
            exchange,
            symboltoken,
            interval,
            fromdate,
            todate
        };
        console.log(`[getCandleData] Requesting:`, params);

        const candleData = await restAPI.getCandleData(params);
        console.log(`[getCandleData] Response length:`, candleData ? candleData.length : 'null/undefined');

        res.json(candleData);
    } catch (error) {
        logger.error('Error fetching candle data:', error);
        console.log(`[getCandleData] Error details:`, error.message);
        res.status(500).json({ message: 'Failed to fetch candle data' });
    }
};
