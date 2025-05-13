const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    console.log('Registration attempt started');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    try {
        const { firstName, lastName, email, password, phoneNumber, gender, role } = req.body;
        console.log('Extracted user data:', { firstName, lastName, email, phoneNumber, gender, role });

        // Check if user already exists
        console.log('Checking if user already exists with email:', email);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists with this email');
            return next(new ErrorResponse('Email already registered', 400));
        }
        console.log('No existing user found, proceeding with creation');

        // Create user
        console.log('Attempting to create new user');
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            gender,
            role: role || 'candidate', // Default to candidate if not specified
            agreedToTerms: true
        });
        console.log('User created successfully with ID:', user._id);

        // Send token response
        console.log('Generating auth token for user');
        sendTokenResponse(user, 201, res);
        console.log('Registration completed successfully');
    } catch (err) {
        console.error('Registration error details:');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);

        if (err.code === 11000) {
            console.error('Duplicate key error - likely email already exists');
            return next(new ErrorResponse('Email already registered', 400));
        }

        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    console.log('Login attempt started');
    console.log('Login request body:', JSON.stringify(req.body, null, 2));

    try {
        const { email, password, role } = req.body;
        console.log('Login attempt for email:', email);

        // Validate email & password
        if (!email || !password) {
            console.log('Missing email or password in request');
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        // Check for user
        console.log('Looking up user by email');
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('No user found with email:', email);
            return next(new ErrorResponse('Invalid credentials', 401));
        }
        console.log('User found with ID:', user._id);

        // Check if password matches
        console.log('Verifying password');
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            console.log('Password verification failed');
            return next(new ErrorResponse('Invalid credentials', 401));
        }
        console.log('Password verified successfully');

        // Verify that the user's role matches the provided role if specified
        if (role && user.role !== role && !(role === 'candidate' && user.role === 'admin') && !(role === 'organizer' && user.role === 'admin')) {
            console.log(`Role mismatch: User is ${user.role}, but attempted to login as ${role}`);
            return next(new ErrorResponse(`This account is not registered as a ${role}`, 403));
        }

        // Check if user is active
        if (!user.isActive) {
            console.log('User account is deactivated:', user._id);
            return next(new ErrorResponse('Your account has been deactivated', 401));
        }
        console.log('User account is active, proceeding with login');

        console.log('Generating auth token for user');
        sendTokenResponse(user, 200, res);
        console.log('Login completed successfully for user:', user._id);
    } catch (err) {
        console.error('Login error details:');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        next(err);
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return next(new ErrorResponse('Password is incorrect', 401));
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    let user;
    try {
        user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorResponse('There is no user with that email', 404));
        }

        // Get reset token
        const resetToken = user.generatePasswordResetToken();

        await user.save({ validateBeforeSave: false });

        // Create reset url - FIXED: Use path construction that avoids path-to-regexp issues
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

        // Don't use API URL in route pattern to avoid path-to-regexp errors
        // const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

        // In a real application, you would send an email with this resetUrl
        // For now, we'll just return it in the response
        res.status(200).json({
            success: true,
            message: 'Token sent to email',
            resetUrl
        });
    } catch (err) {
        console.error(err);

        // Only try to reset fields if user was found
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }

        return next(new ErrorResponse('Email could not be sent', 500));
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new ErrorResponse('Invalid token', 400));
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
    console.log('sendTokenResponse called for user:', user._id);

    try {
        // Create token
        console.log('Generating authentication token');
        const token = user.generateAuthToken();
        console.log('Token generated successfully');

        const options = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };

        if (process.env.NODE_ENV === 'production') {
            options.secure = true;
        }

        console.log('Sending response with token and cookie');
        res
            .status(statusCode)
            .cookie('token', token, options)
            .json({
                success: true,
                token
            });
        console.log('Response sent successfully');
    } catch (error) {
        console.error('Error in sendTokenResponse:', error);
        throw error; // Re-throw to be caught by the calling function
    }
}; 