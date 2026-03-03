/**
 * Simple Logger Utility
 * Provides colored console logging with context
 */

const LOG_LEVELS = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

const COLORS = {
    DEBUG: '\x1b[36m',   // Cyan
    INFO: '\x1b[34m',    // Blue
    SUCCESS: '\x1b[32m', // Green
    WARN: '\x1b[33m',    // Yellow
    ERROR: '\x1b[31m',   // Red
    RESET: '\x1b[0m'
};

class Logger {
    constructor(context = 'App') {
        this.context = context;
    }

    log(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const color = COLORS[level] || COLORS.INFO;
        const prefix = `${color}${level === 'INFO' ? 'ℹ️' : level === 'SUCCESS' ? '✅' : level === 'WARN' ? '⚠️' : level === 'ERROR' ? '❌' : '🔍'}  [${this.context}]${COLORS.RESET}`;
        
        console.log(prefix, message, ...args);
    }

    debug(message, ...args) {
        if (process.env.LOG_LEVEL === 'debug') {
            this.log(LOG_LEVELS.DEBUG, message, ...args);
        }
    }

    info(message, ...args) {
        this.log(LOG_LEVELS.INFO, message, ...args);
    }

    success(message, ...args) {
        this.log(LOG_LEVELS.SUCCESS, message, ...args);
    }

    warn(message, ...args) {
        this.log(LOG_LEVELS.WARN, message, ...args);
    }

    error(message, ...args) {
        this.log(LOG_LEVELS.ERROR, message, ...args);
    }
}

export function createLogger(context) {
    return new Logger(context);
}

export default Logger;
