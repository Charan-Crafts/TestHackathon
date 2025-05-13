import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRegBell } from "react-icons/fa6";
import { TrophyIcon, BriefcaseIcon, ChartBarIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Sample notifications data - in a real app, this would be fetched from an API
const notifications = [
  {
    id: 1,
    type: 'hackathon',
    title: 'New Hackathon',
    message: 'A new AI hackathon has been announced!',
    time: '2 hours ago',
    read: false
  },
  {
    id: 2,
    type: 'challenge',
    title: 'Challenge Completed',
    message: 'You successfully completed the weekly coding challenge.',
    time: 'Yesterday',
    read: false
  },
  {
    id: 3,
    type: 'system',
    title: 'Account Update',
    message: 'Your profile has been updated with new badges.',
    time: '3 days ago',
    read: false
  }
];

function NotificationsDropdown({ 
  notificationCount, 
  setNotificationCount, 
  showNotifications, 
  toggleNotifications,
  onNavigate
}) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotificationCount(0);
  };

  // Render the notifications content (shared between mobile and desktop)
  const renderNotificationsContent = () => (
    <>
      <div className={`${isMobile ? 'py-4 px-3' : 'p-3'} border-b border-gray-700 flex justify-between items-center`}>
        <h3 className={`${isMobile ? 'text-lg' : ''} text-white font-semibold`}>Notifications</h3>
        <div className="flex items-center">
          <button 
            onClick={markAllAsRead}
            className="text-xs text-indigo-400 hover:text-indigo-300 mr-2"
          >
            Mark all as read
          </button>
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
        {notifications.length > 0 ? (
          <div>
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-3 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer ${notification.read ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mr-3 ${
                    notification.type === 'hackathon' ? 'bg-indigo-700' :
                    notification.type === 'challenge' ? 'bg-green-700' : 'bg-purple-700'
                  }`}>
                    {notification.type === 'hackathon' && <TrophyIcon className="h-5 w-5 text-indigo-300" />}
                    {notification.type === 'challenge' && <BriefcaseIcon className="h-5 w-5 text-green-300" />}
                    {notification.type === 'system' && <ChartBarIcon className="h-5 w-5 text-purple-300" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{notification.title}</p>
                    <p className="text-xs text-gray-300 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-1"></div>
                  )}
                </div>
              </div>
            ))}
            <div className="p-2 text-center">
              <Link 
                to="/notifications"
                className={`${isMobile ? 'text-base' : 'text-sm'} text-indigo-400 hover:text-indigo-300`}
                onClick={() => {
                  toggleNotifications();
                  onNavigate();
                }}
              >
                View all notifications
              </Link>
            </div>
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
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>
      
      {/* Notifications Display - Dropdown or Full Screen based on screen size */}
      {showNotifications && (
        <>
          {/* Mobile Full Screen Notifications */}
          {isMobile ? (
            <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
              {renderNotificationsContent()}
            </div>
          ) : (
            /* Desktop Dropdown */
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