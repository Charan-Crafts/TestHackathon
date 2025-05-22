import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRegBell } from "react-icons/fa6";
import { TrophyIcon, BriefcaseIcon, ChartBarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';
import API from '../../services/api';
import { toast } from 'react-hot-toast';

function NotificationsDropdown() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching notifications...');
      const response = await API.get('/notifications');
      console.log('Notifications response:', response.data);

      if (response.data.success) {
        setNotifications(response.data.data);
        const unreadCount = response.data.data.filter(n => !n.read).length;
        setUnreadCount(unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications(); // Refresh notifications when opening dropdown
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await API.put(`/notifications/${notificationId}/read`);
      if (response.data.success) {
        setNotifications(prev =>
          prev.map(n =>
            n._id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await API.put('/notifications/mark-all-read');
      if (response.data.success) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Handle accept team request
  const handleAcceptRequest = async (e, notification) => {
    e.stopPropagation(); // Prevent notification click handler
    try {
      console.log('Accepting team request:', notification._id);
      const response = await API.put(`/notifications/${notification._id}/respond`, {
        response: 'accepted'
      });

      if (response.data.success) {
        toast.success('Team join request accepted');
        // Update notification in state
        setNotifications(prev =>
          prev.map(n =>
            n._id === notification._id
              ? { ...n, status: 'accepted', read: true }
              : n
          )
        );
        // Refresh notifications to get updated team status
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error accepting team request:', error);
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  // Handle reject team request
  const handleRejectRequest = async (e, notification) => {
    e.stopPropagation(); // Prevent notification click handler
    try {
      console.log('Rejecting team request:', notification._id);
      const response = await API.put(`/notifications/${notification._id}/respond`, {
        response: 'rejected'
      });

      if (response.data.success) {
        toast.success('Team join request rejected');
        setNotifications(prev =>
          prev.map(n =>
            n._id === notification._id
              ? { ...n, status: 'rejected', read: true }
              : n
          )
        );
      }
    } catch (error) {
      console.error('Error rejecting team request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TEAM_JOIN_REQUEST':
      case 'TEAM_REQUEST_ACCEPTED':
      case 'TEAM_REQUEST_REJECTED':
        return <BriefcaseIcon className="h-5 w-5 text-green-300" />;
      case 'hackathon':
        return <TrophyIcon className="h-5 w-5 text-indigo-300" />;
      case 'system':
        return <ChartBarIcon className="h-5 w-5 text-purple-300" />;
      default:
        return <FaRegBell className="h-5 w-5 text-gray-300" />;
    }
  };

  // Get notification background color based on type
  const getNotificationBgColor = (type) => {
    switch (type) {
      case 'TEAM_JOIN_REQUEST':
      case 'TEAM_REQUEST_ACCEPTED':
      case 'TEAM_REQUEST_REJECTED':
        return 'bg-green-700';
      case 'hackathon':
        return 'bg-indigo-700';
      case 'system':
        return 'bg-purple-700';
      default:
        return 'bg-gray-700';
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    // Handle navigation based on notification type and metadata
    if (notification.metadata?.teamId) {
      window.location.href = `/team/${notification.metadata.teamId}`;
    }
  };

  // Get notification status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Render notification content
  const renderNotificationContent = (notification) => (
    <>
      <div className="flex items-start">
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mr-3 ${getNotificationBgColor(notification.type)}`}>
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{notification.title}</p>
          <p className="text-xs text-gray-300 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </p>

          {/* Show status if not pending */}
          {notification.status && notification.status !== 'pending' && (
            <p className={`text-xs mt-1 ${getStatusColor(notification.status)}`}>
              {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
            </p>
          )}

          {/* Show accept/reject buttons for pending team join requests */}
          {notification.type === 'TEAM_JOIN_REQUEST' && notification.status === 'pending' && (
            <div className="mt-2 flex space-x-2">
              <button
                onClick={(e) => handleAcceptRequest(e, notification)}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={(e) => handleRejectRequest(e, notification)}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-1"></div>
        )}
      </div>
    </>
  );

  // Render notifications content
  const renderNotificationsContent = () => (
    <>
      <div className={`${isMobile ? 'py-4 px-3' : 'p-3'} border-b border-gray-700 flex justify-between items-center`}>
        <h3 className={`${isMobile ? 'text-lg' : ''} text-white font-semibold`}>
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h3>
        <div className="flex items-center">
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-indigo-400 hover:text-indigo-300 mr-2"
            >
              Mark all as read
            </button>
          )}
          {isMobile && (
            <button
              onClick={toggleNotifications}
              className="p-1 text-white hover:text-gray-300"
              aria-label="Close notifications"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
      <div className={`${isMobile ? 'flex-grow overflow-y-auto' : 'max-h-96 overflow-y-auto'}`}>
        {loading ? (
          <div className="p-5 text-center text-gray-400">
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-5 text-center text-red-400">
            <p>{error}</p>
          </div>
        ) : notifications.length > 0 ? (
          <div>
            {notifications.map(notification => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer ${notification.read ? 'opacity-70' : ''}`}
              >
                {renderNotificationContent(notification)}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 text-center text-gray-400">
            <div className="flex justify-center mb-3">
              <FaRegBell className="h-8 w-8 text-gray-600" />
            </div>
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="relative notification-bell">
      <button
        onClick={toggleNotifications}
        className="p-1 text-white hover:text-indigo-300 relative transition-colors"
        aria-label="Notifications"
      >
        <FaRegBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          {isMobile ? (
            <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
              {renderNotificationsContent()}
            </div>
          ) : (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
              {renderNotificationsContent()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NotificationsDropdown; 