/**
 * API utility functions for making authenticated requests
 */

/**
 * Makes an authenticated request to the API
 * Automatically includes the JWT token from localStorage
 * 
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export const makeAuthenticatedRequest = async (url, options = {}) => {
  // Get the access token from localStorage
  const token = localStorage.getItem('accessToken');
  
  // Prepare headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Make the request with updated headers
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // If we get a 401 (Unauthorized), try to refresh the token
  if (response.status === 401 && token) {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const { accessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
          
          // Update tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry the original request with the new token
          headers.Authorization = `Bearer ${accessToken}`;
          return fetch(url, {
            ...options,
            headers,
          });
        }
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
  
  return response;
};

/**
 * Makes a simple GET request to the API
 * 
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} - The parsed JSON response
 */
export const apiGet = async (url) => {
  const response = await makeAuthenticatedRequest(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Makes a POST request to the API
 * 
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The data to send
 * @returns {Promise<Object>} - The parsed JSON response
 */
export const apiPost = async (url, data) => {
  const response = await makeAuthenticatedRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Makes a PUT request to the API
 * 
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The data to send
 * @returns {Promise<Object>} - The parsed JSON response
 */
export const apiPut = async (url, data) => {
  const response = await makeAuthenticatedRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Makes a DELETE request to the API
 * 
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} - The parsed JSON response
 */
export const apiDelete = async (url) => {
  const response = await makeAuthenticatedRequest(url, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
