const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Define User schema
const UserSchema = new mongoose.Schema({
    // Basic user information
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
        required: true
    },
    // User type/role
    role: {
        type: String,
        enum: ['candidate', 'organizer', 'admin'],
        default: 'candidate'
    },
    // Account status and metadata
    isActive: {
        type: Boolean,
        default: true
    },
    agreedToTerms: {
        type: Boolean,
        default: false,
        required: [true, 'You must agree to the terms and conditions']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    // For password reset functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
    // Only hash the password if it's modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash password with salt
        this.password = await bcrypt.hash(this.password, salt);

        // Update the updatedAt field
        this.updatedAt = Date.now();

        next();
    } catch (error) {
        next(error);
    }
});

// Method to match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function () {
    // Make sure we have a sensible default if the env variable is missing or invalid
    const expiresIn = process.env.JWT_EXPIRE || '30d';

    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET || 'hackathon_jwt_secret',
        { expiresIn } // Using a string value like '30d', '24h', etc.
    );
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

module.exports = mongoose.model('User', UserSchema); 