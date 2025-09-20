const rateLimit = require('express-rate-limit');

// DISABLED RATE LIMITING - Set extremely high limits to never trigger
// All rate limits are set to 999999 requests to effectively disable them

// General rate limiter for public routes - DISABLED
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 999999, // Effectively unlimited
  message: {
    error: 'Rate limit disabled - this should never show',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit disabled - this should never show',
      retryAfter: Math.round(15 * 60)
    });
  }
});

// Auth rate limiter - DISABLED
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 999999, // Effectively unlimited
  message: {
    error: 'Rate limit disabled - this should never show',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit disabled - this should never show',
      retryAfter: Math.round(15 * 60)
    });
  }
});

// API rate limiter - DISABLED
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 999999, // Effectively unlimited
  message: {
    error: 'Rate limit disabled - this should never show',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit disabled - this should never show',
      retryAfter: Math.round(15 * 60)
    });
  }
});

// Heavy GET routes - DISABLED
const heavyGetLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 999999, // Effectively unlimited
  message: {
    error: 'Rate limit disabled - this should never show',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit disabled - this should never show',
      retryAfter: Math.round(1 * 60)
    });
  }
});

// POST routes - DISABLED
const postLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 999999, // Effectively unlimited
  message: {
    error: 'Rate limit disabled - this should never show',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit disabled - this should never show',
      retryAfter: Math.round(1 * 60)
    });
  }
});

// File upload rate limiter - DISABLED
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 999999, // Effectively unlimited
  message: {
    error: 'Rate limit disabled - this should never show',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit disabled - this should never show',
      retryAfter: Math.round(15 * 60)
    });
  }
});

// Sensitive operations rate limiter - DISABLED
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 999999, // Effectively unlimited
  message: {
    error: 'Rate limit disabled - this should never show',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit disabled - this should never show',
      retryAfter: Math.round(60 * 60)
    });
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  apiLimiter,
  heavyGetLimiter,
  postLimiter,
  uploadLimiter,
  sensitiveLimiter
};
