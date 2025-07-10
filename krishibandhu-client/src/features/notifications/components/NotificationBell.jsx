import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const { t } = useTranslation();
  const { unreadCount, notifications } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Update document title when unread count changes
  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) KrishiBandhu`;
      setHasNewNotifications(true);
    } else {
      document.title = 'KrishiBandhu';
      setHasNewNotifications(false);
    }
  }, [unreadCount]);
  
  // Animation effect when new notifications arrive
  useEffect(() => {
    if (notifications.length > 0 && !hasNewNotifications) {
      const latestNotification = notifications[0];
      const currentTime = new Date();
      const notificationTime = new Date(latestNotification.createdAt);
      
      // If the latest notification is less than 30 seconds old and unread
      if (!latestNotification.read && 
          (currentTime - notificationTime) / 1000 < 30) {
        setHasNewNotifications(true);
      }
    }
  }, [notifications]);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
    if (!showDropdown) {
      setHasNewNotifications(false);
    }
  };
  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className={`relative p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ${
          unreadCount > 0 
            ? 'text-green-600 hover:bg-green-100' 
            : 'text-gray-600 hover:bg-gray-100'
        } ${hasNewNotifications ? 'animate-pulse' : ''}`}
        aria-label={t('notifications.aria')}
        title={unreadCount > 0 ? `${unreadCount} ${t('notifications.unread').toLowerCase()}` : t('notifications.title')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" 
          className={`h-6 w-6 transition-transform duration-300 ${showDropdown ? 'rotate-12' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span 
            className={`absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 rounded-full ${
              hasNewNotifications 
                ? 'bg-red-600 animate-bounce' 
                : 'bg-red-600'
            }`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      <NotificationDropdown 
        isOpen={showDropdown} 
        onClose={() => setShowDropdown(false)} 
      />
    </div>
  );
};

export default NotificationBell;
