import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, handleApiError } from '../services/api';
import { debug, errorLogger } from '../utils/debugHelper';

// Create a context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    debug('AuthProvider initializing');
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userVerification, setUserVerification] = useState(null);

    // Check if user is authenticated
    const isAuthenticated = !!token;

    // Load user from local storage on mount
    useEffect(() => {
        const loadUser = async () => {
            debug('Loading user from token');
            if (token) {
                try {
                    debug('Token exists, fetching current user');
                    const response = await authAPI.getCurrentUser();
                    debug('User data fetched successfully');
                    setUser(response.data.data);
                } catch (err) {
                    // Token might be invalid or expired
                    errorLogger(err, 'Failed to load user from token');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            } else {
                debug('No token found, user not authenticated');
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    // Always fetch userVerification when user is loaded and is organizer
    useEffect(() => {
        const fetchVerification = async () => {
            if (user && user.role === 'organizer') {
                try {
                    const verificationRes = await require('../services/api').verificationAPI.getMyVerification();
                    setUserVerification(verificationRes.data.data);
                } catch (e) {
                    setUserVerification(null);
                }
            } else {
                setUserVerification(null);
            }
        };
        fetchVerification();
    }, [user]);

    // Register a new user
    const register = async (userData) => {
        debug('Register function called with data', userData);
        setLoading(true);
        setError(null);

        try {
            debug('Making register API call');
            const response = await authAPI.register(userData);
            debug('Register API call successful', response.data);
            const { token: newToken } = response.data;

            // Save token to localStorage and state
            debug('Saving token to localStorage and state');
            localStorage.setItem('token', newToken);
            setToken(newToken);

            // Fetch user data
            debug('Fetching user data after registration');
            const userResponse = await authAPI.getCurrentUser();
            debug('User data fetch successful', userResponse.data);
            const userDetails = userResponse.data.data;

            // Save user to localStorage and state
            debug('Saving user to localStorage and state');
            localStorage.setItem('user', JSON.stringify(userDetails));
            setUser(userDetails);

            // Fetch verification status
            try {
                const verificationRes = await require('../services/api').verificationAPI.getMyVerification();
                setUserVerification(verificationRes.data.data);
            } catch (e) {
                setUserVerification(null);
            }

            debug('Registration process completed successfully');
            setLoading(false);
            return {
                success: true,
                data: userDetails,
                role: userDetails.role
            };
        } catch (err) {
            errorLogger(err, 'Registration process failed');
            setLoading(false);
            const errorData = handleApiError(err);
            setError(errorData.message);
            return { success: false, error: errorData };
        }
    };

    // Login user
    const login = async (credentials) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Login attempt with role:', credentials.role);
            const response = await authAPI.login(credentials);
            const { token: newToken } = response.data;

            // Save token to localStorage and state
            localStorage.setItem('token', newToken);
            setToken(newToken);

            // Fetch user data
            const userResponse = await authAPI.getCurrentUser();
            const userDetails = userResponse.data.data;

            console.log('Logged in user role:', userDetails.role);

            // Save user to localStorage and state
            localStorage.setItem('user', JSON.stringify(userDetails));
            setUser(userDetails);

            // Fetch verification status
            try {
                const verificationRes = await require('../services/api').verificationAPI.getMyVerification();
                setUserVerification(verificationRes.data.data);
            } catch (e) {
                setUserVerification(null);
            }

            setLoading(false);
            return { success: true, data: userDetails };
        } catch (err) {
            setLoading(false);
            const errorData = handleApiError(err);
            setError(errorData.message);
            return { success: false, error: errorData };
        }
    };

    // Logout user
    const logout = async () => {
        setLoading(true);
        try {
            if (token) {
                // Call the logout API
                await authAPI.logout();
            }

            // Clear localStorage and state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);

            setLoading(false);
            return { success: true };
        } catch (err) {
            setLoading(false);
            const errorData = handleApiError(err);
            setError(errorData.message);

            // Even if API fails, clear local state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);

            return { success: false, error: errorData };
        }
    };

    // Update user details
    const updateProfile = async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.updateUserDetails(userData);
            const updatedUser = response.data.data;

            // Update local user data
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            setLoading(false);
            return { success: true, data: updatedUser };
        } catch (err) {
            setLoading(false);
            const errorData = handleApiError(err);
            setError(errorData.message);
            return { success: false, error: errorData };
        }
    };

    // Update password
    const updatePassword = async (passwordData) => {
        setLoading(true);
        setError(null);

        try {
            await authAPI.updatePassword(passwordData);
            setLoading(false);
            return { success: true };
        } catch (err) {
            setLoading(false);
            const errorData = handleApiError(err);
            setError(errorData.message);
            return { success: false, error: errorData };
        }
    };

    // Reset password
    const resetPassword = async (token, password) => {
        setLoading(true);
        setError(null);

        try {
            await authAPI.resetPassword(token, password);
            setLoading(false);
            return { success: true };
        } catch (err) {
            setLoading(false);
            const errorData = handleApiError(err);
            setError(errorData.message);
            return { success: false, error: errorData };
        }
    };

    // Request password reset
    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.forgotPassword(email);
            setLoading(false);
            return {
                success: true,
                data: response.data
            };
        } catch (err) {
            setLoading(false);
            const errorData = handleApiError(err);
            setError(errorData.message);
            return { success: false, error: errorData };
        }
    };

    // Clear errors
    const clearErrors = () => setError(null);

    // Context value
    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        userVerification,
        register,
        login,
        logout,
        updateProfile,
        updatePassword,
        forgotPassword,
        resetPassword,
        clearErrors,
        updateUserRole: (role) => {
            if (user) {
                const updatedUser = { ...user, role };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                return { success: true };
            }
            return { success: false, error: 'No user logged in' };
        }
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext; 