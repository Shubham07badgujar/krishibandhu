import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../features/notifications/services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  // Set up polling for new notifications (every 60 seconds)
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        fetchNotifications();
      }, 60000); // 1 minute
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // State for success messages
  const [successMessage, setSuccessMessage] = useState(null);

  // Helper to show success message and auto-clear it
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update the local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Show success message
      showSuccessMessage('notifications.success');
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      
      // Remove from local state
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      );
      
      // Show success message
      showSuccessMessage('notifications.deleteSuccess');
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length === 0) return;
    
    // Create an array of promises for marking each unread notification as read
    const readPromises = unreadNotifications.map(n => 
      markNotificationAsRead(n._id).then(() => n._id)
    );
    
    // Execute all promises
    try {
      const markedIds = await Promise.all(readPromises);
      
      // Update local state in one batch
      setNotifications(prev => 
        prev.map(notification => 
          markedIds.includes(notification._id) 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Show success message
      showSuccessMessage('notifications.markAllSuccess');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    successMessage,
    fetchNotifications,
    markAsRead,
    removeNotification,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
