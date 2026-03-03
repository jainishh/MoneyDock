import cron from 'node-cron';
import { autoLoginAngelOne } from '../controllers/angelController.js';
import restAPI from '../services/angelOneRestAPI.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('AngelCron');

/**
 * Run login and update services
 */
const runAngelLogin = async () => {
    try {
        logger.info('Starting scheduled Angel One login...');

        // 1. Perform Login (Updates DB)
        const loginResult = await autoLoginAngelOne();

        if (loginResult && loginResult.status) {
            // 2. Re-initialize REST API with new tokens
            await restAPI.initialize({
                jwtToken: loginResult.jwtToken,
                apiKey: loginResult.apiKey,
                clientCode: loginResult.clientCode,
                feedToken: loginResult.feedToken
            });

            logger.success('Angel One Login & Service Update Complete');
        } else {
            logger.error('Angel One Login Failed:', loginResult?.message);
        }

    } catch (error) {
        logger.error('Critical Error in Angel Login Cron:', error);
    }
};

/**
 * Initialize Cron Jobs
 */
const startAngelLoginCron = () => {
    // Schedule for 08:30 AM Daily
    cron.schedule('30 8 * * *', () => {
        logger.info('Triggering daily auto-login at 08:30 AM');
        runAngelLogin();
    });

    // Run immediately on server startup to fix any stale tokens
    logger.info('Running initial login check on startup...');
    runAngelLogin();
};

export default startAngelLoginCron;
