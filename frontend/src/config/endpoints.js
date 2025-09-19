/**
 * Centralized API endpoint definitions
 * Standardizes all API endpoints across the application
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password`,
    VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
    RESEND_VERIFICATION: `${API_BASE_URL}/api/auth/resend-verification`
  },

  // Reports endpoints
  REPORTS: {
    BASE: `${API_BASE_URL}/api/reports`,
    CREATE: `${API_BASE_URL}/api/reports`,
    GET_ALL: `${API_BASE_URL}/api/reports`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/reports/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/reports/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/reports/${id}`,
    CLOSE: (id) => `${API_BASE_URL}/api/reports/${id}/close`,
    TIMELINE: (id) => `${API_BASE_URL}/api/reports/${id}/timeline`,
    NEARBY: `${API_BASE_URL}/api/reports/nearby`,
    CHECK_DUPLICATE: `${API_BASE_URL}/api/reports/check-duplicate`,
    PRIORITY_VOTE: (id) => `${API_BASE_URL}/api/reports/${id}/priority`,
    ADD_UPDATE: (id) => `${API_BASE_URL}/api/reports/${id}/updates`
  },

  // Comments endpoints
  COMMENTS: {
    BASE: `${API_BASE_URL}/api/comments`,
    GET_BY_REPORT: (reportId) => `${API_BASE_URL}/api/comments/${reportId}`,
    CREATE: (reportId) => `${API_BASE_URL}/api/comments/${reportId}`,
    DELETE: (commentId) => `${API_BASE_URL}/api/comments/${commentId}`
  },

  // Attachments endpoints
  ATTACHMENTS: {
    BASE: `${API_BASE_URL}/api/attachments`,
    UPLOAD: (reportId) => `${API_BASE_URL}/api/attachments/${reportId}/upload`,
    GET_BY_REPORT: (reportId) => `${API_BASE_URL}/api/attachments/${reportId}`,
    GET_FILE: (attachmentId) => `${API_BASE_URL}/api/attachments/file/${attachmentId}`,
    DELETE: (attachmentId) => `${API_BASE_URL}/api/attachments/${attachmentId}`
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    BASE: `${API_BASE_URL}/api/notifications`,
    GET_ALL: `${API_BASE_URL}/api/notifications`,
    MARK_READ: `${API_BASE_URL}/api/notifications/mark-read`,
    GET_UNREAD_COUNT: `${API_BASE_URL}/api/notifications/unread-count`
  },

  // Users endpoints
  USERS: {
    BASE: `${API_BASE_URL}/api/users`,
    GET_ALL: `${API_BASE_URL}/api/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/users/profile`,
    UPLOAD_AVATAR: `${API_BASE_URL}/api/users/avatar`
  },

  // Admin endpoints
  ADMIN: {
    BASE: `${API_BASE_URL}/api/admin`,
    DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
    USERS: `${API_BASE_URL}/api/admin/users`,
    REPORTS: `${API_BASE_URL}/api/admin/reports`,
    ANALYTICS: `${API_BASE_URL}/api/admin/analytics`
  },

  // Cities endpoints
  CITIES: {
    BASE: `${API_BASE_URL}/api/cities`,
    GET_ALL: `${API_BASE_URL}/api/cities`,
    GET_BY_SLUG: (slug) => `${API_BASE_URL}/api/cities/${slug}`
  },

  // Alerts endpoints
  ALERTS: {
    BASE: `${API_BASE_URL}/api/alerts`,
    CREATE: `${API_BASE_URL}/api/alerts`,
    GET_ALL: `${API_BASE_URL}/api/alerts`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/alerts/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/alerts/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/alerts/${id}`
  },

  // Events endpoints
  EVENTS: {
    BASE: `${API_BASE_URL}/api/events`,
    CREATE: `${API_BASE_URL}/api/events`,
    GET_ALL: `${API_BASE_URL}/api/events`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/events/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/api/events/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/events/${id}`
  },

  // AI endpoints
  AI: {
    BASE: `${API_BASE_URL}/api/ai`,
    CHAT: `${API_BASE_URL}/api/ai/chat`,
    SUGGEST_CATEGORY: `${API_BASE_URL}/api/ai/suggest-category`,
    ANALYZE_REPORT: `${API_BASE_URL}/api/ai/analyze-report`
  }
};

export default ENDPOINTS;
