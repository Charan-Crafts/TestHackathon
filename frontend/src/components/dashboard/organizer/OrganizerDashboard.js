import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const OrganizerDashboard = () => {
    const { user, userVerification } = useAuth();

    // Check if user is verified organizer
    if (!user || user.role !== 'organizer' || !userVerification || userVerification.status !== 'approved') {
        return <Navigate to="/verification" replace />;
    }

    return (
        <div style={{ color: 'white', padding: '2rem' }}>
            Welcome to the Organizer Dashboard!
        </div>
    );
};

export default OrganizerDashboard; 