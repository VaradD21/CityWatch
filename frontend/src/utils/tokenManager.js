/**
 * Centralized token management utility
 * Handles token refresh logic to avoid duplication
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - The refresh token
 * @returns {Promise<{accessToken: string, refreshToken: string}>} - New tokens
 */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

/**
 * Store tokens in localStorage
 * @param {string} accessToken - The access token
 * @param {string} refreshToken - The refresh token
 */
export const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Clear tokens from localStorage
 */
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Get stored access token
 * @returns {string|null} - The access token or null
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Get stored refresh token
 * @returns {string|null} - The refresh token or null
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};
