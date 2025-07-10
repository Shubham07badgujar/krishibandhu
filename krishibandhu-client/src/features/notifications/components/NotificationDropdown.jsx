import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    removeNotification, 
    markAllAsRead 
  } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.type === 'loan_application' || notification.type === 'loan_status') {
      // Navigate to loan details if referenceId exists
      if (notification.referenceId) {
        navigate(`/loans/${notification.referenceId}`);
      } else {
        navigate('/loans');
      }
    }
    
    onClose();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'loan_application':
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'loan_status':
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 max-h-[500px] overflow-auto"
      style={{ top: '100%' }}
    >
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-800">{t('notifications.title')}</h3>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="p-4 text-center">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-400 rounded-full"></div>
          <p className="mt-1 text-gray-500">{t('notifications.loading')}</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-7 w-7 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p>{t('notifications.empty')}</p>
        </div>
      ) : (
        <div>
          {notifications.map((notification) => (
            <div 
              key={notification._id}
              className={`flex p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="mr-3 flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-gray-800'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification._id);
                }}
                className="ml-2 text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="p-2 border-t text-center">
        <button 
          onClick={() => {
            navigate('/notifications');
            onClose();
          }}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {t('notifications.viewAll')}
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
