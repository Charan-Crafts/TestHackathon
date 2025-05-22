const mongoose = require('mongoose');

const RoundResponseSchema = new mongoose.Schema({
    // Associated entities
    hackathonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: [true, 'Hackathon ID is required']
    },
    roundId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Round ID is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },

    // Responses to custom fields
    responses: [{
        fieldId: {
            type: String,
            required: [true, 'Field ID is required']
        },
        fieldName: {
            type: String,
            required: [true, 'Field name is required']
        },
        fieldType: {
            type: String,
            required: [true, 'Field type is required'],
            enum: ['text', 'paragraph', 'multiple_choice', 'checkbox', 'dropdown', 'file', 'date', 'time', 'platform_link']
        },
        value: {
            type: mongoose.Schema.Types.Mixed, // Can store any type of value
            required: [true, 'Response value is required']
        },
        files: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }]
    }],

    // Submission status
    status: {
        type: String,
        enum: ['draft', 'submitted', 'under-review', 'evaluated', 'qualified', 'unqualified', 'awarded', 'reviewed'],
        default: 'draft'
    },

    // Judge review fields
    score: {
        type: Number
    },
    qualification: {
        type: String,
        enum: ['qualified', 'unqualified'],
        default: 'qualified'
    },
    awardType: {
        type: String,
        enum: ['none', 'first', 'second', 'third', 'category', 'honorable'],
        default: 'none'
    },
    awardTitle: {
        type: String
    },
    reviewComments: {
        type: String
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    },

    // Metadata
    submittedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for faster queries
RoundResponseSchema.index({ hackathonId: 1, roundId: 1, userId: 1 }, { unique: true });
RoundResponseSchema.index({ teamId: 1 });

// Update timestamps
RoundResponseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('RoundResponse', RoundResponseSchema); 