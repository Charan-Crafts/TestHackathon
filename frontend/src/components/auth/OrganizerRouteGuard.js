import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import VerificationPending from '../dashboard/user/VerificationPending';
import { toast } from 'react-hot-toast';
import API from '../../services/api';

const OrganizerRouteGuard = ({ children }) => {
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkVerificationStatus = async () => {
            try {
                const response = await API.get('/verifications/status');
                setVerificationStatus(response.data.data);
            } catch (error) {
                console.error('Error checking verification status:', error);
                setVerificationStatus(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkVerificationStatus();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Always check verificationStatus for organizer access
    if (!verificationStatus) {
        // No verification request found, treat as not verified
        return <VerificationPending />;
    }

    if (verificationStatus.status === 'pending') {
        return <VerificationPending />;
    }

    if (verificationStatus.status === 'rejected') {
        toast.error('Your verification was rejected. Please update your information.');
        return <Navigate to="/organizer/verify" replace state={{ rejected: true }} />;
    }

    if (verificationStatus.status === 'approved') {
        // Only allow access if verification is approved
        return children;
    }

    // Default: show pending
    return <VerificationPending />;
};

export default OrganizerRouteGuard; 