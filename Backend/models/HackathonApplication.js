const mongoose = require('mongoose');

const HackathonApplicationSchema = new mongoose.Schema({
    // Organizer Information
    organizerName: {
        type: String,
        required: [true, 'Organizer name is required'],
        trim: true
    },
    organizerEmail: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    organizerWebsite: {
        type: String,
        trim: true
    },

    // User reference (if logged in)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Hackathon Information
    hackathonName: {
        type: String,
        required: [true, 'Hackathon name is required'],
        trim: true
    },
    hackathonTheme: {
        type: String,
        required: [true, 'Theme is required'],
        trim: true
    },
    tentativeDates: {
        type: String,
        required: [true, 'Tentative dates are required'],
        trim: true
    },
    purpose: {
        type: String,
        required: [true, 'Purpose is required'],
        trim: true
    },

    // Additional Information
    expectedParticipants: {
        type: Number,
        min: [0, 'Expected participants cannot be negative']
    },
    locationPreference: {
        type: String,
        enum: ['online', 'offline', 'hybrid'],
        default: 'online'
    },
    targetAudience: {
        type: String,
        trim: true
    },
    additionalInformation: {
        type: String,
        trim: true
    },

    // Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware to update updatedAt timestamp
HackathonApplicationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for the reviewer
HackathonApplicationSchema.virtual('reviewer', {
    ref: 'User',
    localField: 'reviewedBy',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('HackathonApplication', HackathonApplicationSchema); 