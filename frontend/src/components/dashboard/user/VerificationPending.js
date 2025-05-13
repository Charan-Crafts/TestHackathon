import React from 'react';
import { ClockIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const VerificationPending = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
            <div className="text-center">
                <ClockIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Verification Pending</h2>
                <p className="text-gray-300 mb-4">
                    Your organizer verification request has been submitted and is currently under review.
                    Our team will process your request within 2-3 business days.
                </p>
                <div className="bg-yellow-900/30 rounded-lg border border-yellow-500/30 p-4 mb-6">
                    <div className="flex items-center mb-2">
                        <LockClosedIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        <p className="text-yellow-300 font-medium">
                            Until your account is verified by an admin, access to organizer features will be restricted.
                        </p>
                    </div>
                    <p className="text-gray-400">
                        You will receive an email notification once your verification status is updated,
                        and all organizer features will be automatically unlocked without requiring a new login.
                    </p>
                    <div className="mt-4 pt-4 border-t border-yellow-700/30">
                        <p className="text-yellow-200 text-sm">
                            <strong>Note:</strong> The organizer dashboard and related features are not available while your verification is pending.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium shadow"
                >
                    Go to Login Page
                </button>
            </div>
        </div>
    );
};

export default VerificationPending; 