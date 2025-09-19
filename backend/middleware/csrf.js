const crypto = require('crypto');

// In-memory store for CSRF tokens (use Redis in production)
const csrfTokens = new Map();

// Generate a secure random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for all API routes - they use JWT authentication which provides CSRF protection
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // Skip CSRF for auth routes (login, signup, etc.) as they don't have sessions yet
  if (req.path.startsWith('/auth/') || req.path === '/auth') {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionId = req.headers['x-session-id'] || req.sessionID;

  if (!token || !sessionId) {
    return res.status(403).json({
      error: 'CSRF token missing',
      code: 'CSRF_TOKEN_MISSING'
    });
  }

  const storedToken = csrfTokens.get(sessionId);
  if (!storedToken || storedToken !== token) {
    return res.status(403).json({
      error: 'Invalid CSRF token',
      code: 'CSRF_TOKEN_INVALID'
    });
  }

  // Token is valid, continue
  next();
};

// Generate CSRF token for session
const generateCSRFToken = (req, res) => {
  const sessionId = req.sessionID || req.headers['x-session-id'] || generateToken();
  const token = generateToken();
  
  // Store token with expiration (1 hour)
  csrfTokens.set(sessionId, token);
  
  // Clean up expired tokens
  setTimeout(() => {
    csrfTokens.delete(sessionId);
  }, 60 * 60 * 1000);

  return {
    token,
    sessionId
  };
};

// Clean up expired tokens periodically
setInterval(() => {
  // In production, implement proper cleanup based on token expiration
  if (csrfTokens.size > 10000) {
    csrfTokens.clear();
  }
}, 60 * 60 * 1000); // Every hour

module.exports = {
  csrfProtection,
  generateCSRFToken
};
