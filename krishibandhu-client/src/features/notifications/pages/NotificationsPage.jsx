import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    notifications, 
    loading, 
    error,
    fetchNotifications, 
    markAsRead, 
    removeNotification,
    markAllAsRead,
    successMessage
  } = useNotifications();

  // State for success toast
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Watch for success messages from the notification context
  useEffect(() => {
    if (successMessage) {
      setToast({ visible: true, message: t(successMessage) });
      
      // Hide toast after 3 seconds
      const timer = setTimeout(() => {
        setToast({ visible: false, message: '' });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, t]);

  // State for filtering and sorting
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'loan_application', 'loan_status', 'general'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'

  // Refresh notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      // Apply read/unread filter
      if (filter === 'read') return notification.read;
      if (filter === 'unread') return !notification.read;
      return true; // 'all' filter
    })
    .filter(notification => {
      // Apply type filter
      if (typeFilter === 'all') return true;
      return notification.type === typeFilter;
    })
    .sort((a, b) => {
      // Apply sorting
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

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
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Success Toast */}
      {toast.visible && (
        <div className="fixed top-20 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fade-in-down">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-green-50 border-b border-green-100">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-semibold text-green-800">{t('notifications.title')}</h1>
            {notifications.filter(n => !n.read).length > 0 && (
              <button 
                onClick={markAllAsRead}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-green-600 mb-2 md:mb-0">
              {notifications.length} {t('notifications.title').toLowerCase()} 
              {filter !== 'all' && ` (${t(`notifications.${filter}`)})`}
            </p>
            
            {/* Filter controls */}
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block appearance-none bg-white border border-gray-200 text-green-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-500 text-sm"
                >
                  <option value="all">{t('notifications.all')}</option>
                  <option value="read">{t('notifications.read')}</option>
                  <option value="unread">{t('notifications.unread')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block appearance-none bg-white border border-gray-200 text-green-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-500 text-sm"
                >
                  <option value="all">{t('notifications.types.general')}</option>
                  <option value="loan_application">{t('notifications.types.loanApplication')}</option>
                  <option value="loan_status">{t('notifications.types.loanStatus')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="block appearance-none bg-white border border-gray-200 text-green-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-500 text-sm"
                >
                  <option value="newest">{t('notifications.newest')}</option>
                  <option value="oldest">{t('notifications.oldest')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-green-500 rounded-full"></div>
            <p className="mt-2 text-gray-600">{t('notifications.loading')}</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={fetchNotifications}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {t('notifications.retry')}
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-lg">
              {notifications.length > 0 ? t('notifications.empty') + ' ' + t('notifications.filterBy').toLowerCase() : t('notifications.empty')}
            </p>
          </div>        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <li 
                key={notification._id}
                className={`flex p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="mr-4 flex-shrink-0 self-start mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-gray-800'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                        
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          notification.type === 'loan_application' ? 'bg-blue-100 text-blue-800' :
                          notification.type === 'loan_status' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t(`notifications.types.${notification.type === 'loan_application' ? 'loanApplication' : 
                                                   notification.type === 'loan_status' ? 'loanStatus' : 
                                                   'general'}`)}
                        </span>
                        
                        {!notification.read && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            {t('notifications.new')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start">
                      {notification.read ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification._id);
                          }}
                          className="ml-2 text-gray-400 hover:text-gray-600 p-1"
                          title={t('notifications.delete')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      ) : (
                        <div className="flex">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            className="ml-2 text-green-400 hover:text-green-600 p-1"
                            title={t('notifications.read')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification._id);
                            }}
                            className="ml-1 text-gray-400 hover:text-gray-600 p-1"
                            title={t('notifications.delete')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {toast.visible && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
