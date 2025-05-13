const mongoose = require('mongoose');

const VerificationRequestSchema = new mongoose.Schema({
    // Personal Details
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    linkedinProfile: {
        type: String,
        trim: true
    },
    photoIdProof: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: [true, 'Photo ID proof is required']
    },

    // Organization Details
    organizationName: {
        type: String,
        required: [true, 'Organization name is required'],
        trim: true
    },
    organizationType: {
        type: String,
        required: [true, 'Organization type is required'],
        enum: ['College', 'Company', 'NGO', 'Individual', 'Other']
    },
    website: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Role/designation is required'],
        trim: true
    },
    organizationEmail: {
        type: String,
        required: [true, 'Organization email is required'],
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    organizationIdProof: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: [true, 'Organization ID proof is required']
    },

    // Verification Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isApproved: {
        type: Boolean,
        default: false
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

// Virtual for photoIdProofFile
VerificationRequestSchema.virtual('photoIdProofFile', {
    ref: 'File',
    localField: 'photoIdProof',
    foreignField: '_id',
    justOne: true
});

// Virtual for organizationIdProofFile
VerificationRequestSchema.virtual('organizationIdProofFile', {
    ref: 'File',
    localField: 'organizationIdProof',
    foreignField: '_id',
    justOne: true
});

// Update the updatedAt timestamp before saving
VerificationRequestSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('VerificationRequest', VerificationRequestSchema); 