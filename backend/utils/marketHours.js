/**
 * Market Hours Utility
 * Checks if NSE market is currently open
 */

import { createLogger } from './logger.js';

const logger = createLogger('MarketHours');

// NSE Market Timings (IST)
const MARKET_CONFIG = {
    timezone: 'Asia/Kolkata',
    openHour: 9,
    openMinute: 15,
    closeHour: 15,
    closeMinute: 30,
    // Trading days: Monday to Friday
    tradingDays: [1, 2, 3, 4, 5] // Mon-Fri
};

/**
 * Check if market is currently open
 * @returns {boolean} - True if market is open
 */
export function isMarketOpen() {
    // Get current time in IST
    const now = new Date();
    const istOffset = 330; // IST is UTC+5:30 in minutes
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (istOffset * 60000));

    // Check if it's a weekend
    const dayOfWeek = istTime.getDay(); // 0 = Sunday, 6 = Saturday
    if (!MARKET_CONFIG.tradingDays.includes(dayOfWeek)) {
        logger.debug('Market closed: Weekend (IST)');
        return false;
    }

    // Get current IST hours and minutes
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;

    // Market open and close times in minutes
    const marketOpenTime = MARKET_CONFIG.openHour * 60 + MARKET_CONFIG.openMinute; // 9:15 = 555
    const marketCloseTime = MARKET_CONFIG.closeHour * 60 + MARKET_CONFIG.closeMinute; // 15:30 = 930

    const isOpen = currentTimeInMinutes >= marketOpenTime && currentTimeInMinutes <= marketCloseTime;

    logger.debug(`Market status check (IST): ${isOpen ? 'OPEN' : 'CLOSED'}`, {
        currentTimeIST: `${hours}:${minutes}`,
        marketHours: '9:15 AM - 3:30 PM'
    });

    return isOpen;
}

/**
 * Get market status with details
 * @returns {object} - Market status info
 */
export function getMarketStatus() {
    const isOpen = isMarketOpen();
    const now = new Date();

    return {
        isOpen,
        currentTime: now.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: true
        }),
        marketHours: '9:15 AM - 3:30 PM',
        tradingDays: 'Monday to Friday',
        nextMarketOpen: isOpen ? null : getNextMarketOpen()
    };
}

/**
 * Calculate next market opening time
 * @returns {string} - Next market open time
 */
export function getNextMarketOpen() {
    const now = new Date();
    const nextOpen = new Date(now);

    // If current day is trading day but after close time, move to next day
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const closeMinutes = MARKET_CONFIG.closeHour * 60 + MARKET_CONFIG.closeMinute;

    if (currentMinutes > closeMinutes || !MARKET_CONFIG.tradingDays.includes(now.getDay())) {
        // Move to next trading day
        let daysToAdd = 1;
        let nextDay = (now.getDay() + daysToAdd) % 7;

        // Skip weekends
        while (!MARKET_CONFIG.tradingDays.includes(nextDay)) {
            daysToAdd++;
            nextDay = (now.getDay() + daysToAdd) % 7;
        }

        nextOpen.setDate(now.getDate() + daysToAdd);
    }

    // Set to market open time
    nextOpen.setHours(MARKET_CONFIG.openHour, MARKET_CONFIG.openMinute, 0, 0);

    return nextOpen.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

/**
 * Check if it's pre-market time (9:00 AM - 9:15 AM)
 * @returns {boolean}
 */
export function isPreMarket() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    const preMarketStart = 9 * 60; // 9:00 AM
    const marketOpen = MARKET_CONFIG.openHour * 60 + MARKET_CONFIG.openMinute; // 9:15 AM

    return currentMinutes >= preMarketStart && currentMinutes < marketOpen;
}

export default {
    isMarketOpen,
    getMarketStatus,
    getNextMarketOpen,
    isPreMarket
};
