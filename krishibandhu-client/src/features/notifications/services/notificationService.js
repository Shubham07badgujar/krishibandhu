import { getAuthToken } from '../../../utils/authUtils';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Fetch user notifications
 * @returns {Promise} Promise that resolves to an array of notifications
 */
export const getNotifications = async () => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch notifications');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId ID of the notification to mark as read
 * @returns {Promise} Promise resolving to the updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to update notification');
    
    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 * @param {string} notificationId ID of the notification to delete
 * @returns {Promise} Promise resolving to success message
 */
export const deleteNotification = async (notificationId) => {
  try {
    // Get token using our utility function
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to delete notification');
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};
