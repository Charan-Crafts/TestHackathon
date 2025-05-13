import React from 'react';

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div className="bg-red-500/10 border border-red-500/50 text-red-100 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
        </div>
    );
};

export default ErrorMessage; 