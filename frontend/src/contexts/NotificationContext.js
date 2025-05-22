import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import API from '../services/api';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated, user } = useAuth();

    // Debug function
    const debugLog = (message, data = null) => {
        const prefix = `[NotificationContext - ${user?.email}]`;
        if (data) {
            console.log(prefix, message, data);
        } else {
            console.log(prefix, message);
        }
    };

    // Initialize Socket.IO connection
    useEffect(() => {
        debugLog('Effect triggered. isAuthenticated:', isAuthenticated);

        if (isAuthenticated) {
            const token = localStorage.getItem('token');
            debugLog('Token status:', token ? 'Present' : 'Missing');

            // Get socket URL from environment variable
            const socketUrl = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';
            debugLog('Attempting connection to:', socketUrl);

            try {
                const newSocket = io(socketUrl, {
                    auth: { token },
                    transports: ['websocket', 'polling'],
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    path: process.env.REACT_APP_SOCKET_PATH || '/socket.io'
                });

                // Connection events
                newSocket.on('connect', () => {
                    debugLog('Socket connected successfully');
                    debugLog('Socket ID:', newSocket.id);
                    debugLog('User ID:', user?._id);
                });

                newSocket.on('connect_error', (error) => {
                    debugLog('Socket connection error:', error);
                    debugLog('Error details:', {
                        message: error.message,
                        description: error.description,
                        type: error.type
                    });
                    toast.error('Failed to connect to notification service');
                });

                // Notification events
                newSocket.on('notification', (notification) => {
                    debugLog('New notification received:', notification);
                    debugLog('Current user ID:', user?._id);
                    debugLog('Notification recipient:', notification.recipient);

                    // Check if this notification is for the current user
                    if (notification.recipient === user?._id) {
                        debugLog('Notification is for current user, processing...');

                        setNotifications(prev => {
                            debugLog('Previous notifications count:', prev.length);
                            return [notification, ...prev];
                        });

                        setUnreadCount(prev => {
                            debugLog('Previous unread count:', prev);
                            return prev + 1;
                        });

                        // Show toast notification
                        toast.success(`${notification.title}\n${notification.message}`, {
                            duration: 5000,
                            position: 'top-right'
                        });
                        debugLog('Toast notification displayed');
                    } else {
                        debugLog('Notification is not for current user, ignoring');
                    }
                });

                newSocket.on('error', (error) => {
                    debugLog('Socket error:', error);
                    toast.error('Notification service error occurred');
                });

                newSocket.on('disconnect', (reason) => {
                    debugLog('Socket disconnected. Reason:', reason);
                    if (reason === 'io server disconnect') {
                        // Server initiated disconnect, try to reconnect
                        newSocket.connect();
                    }
                });

                setSocket(newSocket);
                debugLog('Socket instance set');

                // Fetch existing notifications
                fetchNotifications();

                return () => {
                    debugLog('Cleaning up socket connection');
                    if (newSocket) {
                        newSocket.close();
                    }
                };
            } catch (error) {
                debugLog('Error initializing socket:', error);
                toast.error('Failed to initialize notification service');
            }
        } else {
            debugLog('User not authenticated, skipping socket connection');
        }
    }, [isAuthenticated, user]);

    // Fetch existing notifications
    const fetchNotifications = async () => {
        try {
            debugLog('Fetching existing notifications');
            const response = await API.get('/notifications');

            if (response.data.success) {
                debugLog('Notifications fetched successfully:', response.data.data);
                setNotifications(response.data.data);
                const unreadCount = response.data.data.filter(n => !n.read).length;
                debugLog('Unread notifications count:', unreadCount);
                setUnreadCount(unreadCount);
            } else {
                throw new Error(response.data.message || 'Failed to fetch notifications');
            }
        } catch (error) {
            debugLog('Error fetching notifications:', error);
            console.error('Full error details:', error);
            toast.error('Failed to fetch notifications');
        }
    };

    // Mark a notification as read
    const markAsRead = async (notificationId) => {
        try {
            debugLog('Marking notification as read:', notificationId);
            const response = await API.put(`/notifications/${notificationId}/read`);

            if (response.data.success) {
                debugLog('Notification marked as read successfully');
                setNotifications(prev =>
                    prev.map(n =>
                        n._id === notificationId ? { ...n, read: true } : n
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                throw new Error(response.data.message || 'Failed to mark notification as read');
            }
        } catch (error) {
            debugLog('Error marking notification as read:', error);
            console.error('Full error details:', error);
            toast.error('Failed to mark notification as read');
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            debugLog('Marking all notifications as read');
            const response = await API.put('/notifications/mark-all-read');

            if (response.data.success) {
                debugLog('All notifications marked as read successfully');
                setNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                );
                setUnreadCount(0);
            } else {
                throw new Error(response.data.message || 'Failed to mark all notifications as read');
            }
        } catch (error) {
            debugLog('Error marking all notifications as read:', error);
            console.error('Full error details:', error);
            toast.error('Failed to mark all notifications as read');
        }
    };

    const value = {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
