import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const OrganizerProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    // Check if user is an organizer
    if (!user || user.role !== 'organizer') {
        return <Navigate to="/login" replace />;
    }

    // Check verification status
    if (!user.hasDetails) {
        // If no verification details submitted, redirect to verification page
        return <Navigate to="/verification" replace />;
    }

    if (!user.hasVerified) {
        // If verification is pending, redirect to verification pending page
        return <Navigate to="/verificationpending" replace />;
    }

    // If fully verified, render the protected content
    return children;
};

export default OrganizerProtectedRoute; 