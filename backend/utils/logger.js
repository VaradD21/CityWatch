/**
 * Production-safe logging utility
 * Only logs in development mode to prevent information disclosure
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args) => {
    // Always log errors, but sanitize in production
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, log errors without sensitive data
      const sanitizedArgs = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          // Remove sensitive fields
          const { password, token, secret, key, ...safe } = arg;
          return safe;
        }
        return arg;
      });
      console.error(...sanitizedArgs);
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

module.exports = logger;
