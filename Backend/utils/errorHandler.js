// Error handler utility functions

// Handle API errors
exports.handleApiError = (res, error) => {
    console.error('API Error:', error);

    // Default error response
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Handle specific error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(error.errors).map(err => err.message).join(', ');
    } else if (error.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${error.path}: ${error.value}`;
    } else if (error.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    } else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    } else if (error.message) {
        message = error.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error : undefined
    });
};

// Handle async errors
exports.catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}; 