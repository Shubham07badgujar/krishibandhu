/**
 * Utility functions for authentication handling
 */

/**
 * Gets the authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    return user.token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Gets the current authenticated user from localStorage
 * @returns {Object|null} The user object or null if not authenticated
 */
export const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Checks if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Checks if the current user has admin privileges
 * @returns {boolean} True if user is an admin, false otherwise
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};
