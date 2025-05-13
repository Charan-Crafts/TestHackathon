const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    // Associated Team and Hackathon
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Team ID is required']
    },
    hackathonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: [true, 'Hackathon ID is required']
    },
    roundId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Round ID is required']
    },

    // Submission Details
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        trim: true
    },

    // Submission Links and Files
    githubUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function (url) {
                return !url || url.startsWith('https://github.com/');
            },
            message: 'GitHub URL must be a valid GitHub repository link'
        }
    },
    demoUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function (url) {
                return !url || /^(http|https):\/\/[^ "]+$/.test(url);
            },
            message: 'Demo URL must be a valid URL'
        }
    },
    videoUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function (url) {
                return !url || /^(http|https):\/\/[^ "]+$/.test(url);
            },
            message: 'Video URL must be a valid URL'
        }
    },

    // Attached files (presentations, designs, etc.)
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],

    // Submission content (for direct text submissions)
    content: {
        type: String,
        trim: true
    },

    // Team & Project Information
    teamName: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true
    },
    teamMembers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
        role: String
    }],
    techStack: [{
        type: String,
        trim: true
    }],

    // Submission Status
    status: {
        type: String,
        enum: ['draft', 'submitted', 'under-review', 'evaluated', 'disqualified'],
        default: 'submitted'
    },

    // Evaluation and Judging
    evaluations: [{
        judgeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        criteria: {
            type: Map,
            of: Number  // Scores for different criteria
        },
        totalScore: {
            type: Number,
            min: 0
        },
        feedback: {
            type: String,
            trim: true
        },
        evaluatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    finalScore: {
        type: Number,
        min: 0,
        default: 0
    },
    rank: {
        type: Number,
        min: 0
    },
    isWinner: {
        type: Boolean,
        default: false
    },
    winningPlace: {
        type: String,
        trim: true
    },

    // Submission Metadata
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Submitter ID is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuals for related entities
SubmissionSchema.virtual('team', {
    ref: 'Team',
    localField: 'teamId',
    foreignField: '_id',
    justOne: true
});

SubmissionSchema.virtual('hackathon', {
    ref: 'Hackathon',
    localField: 'hackathonId',
    foreignField: '_id',
    justOne: true
});

SubmissionSchema.virtual('submitter', {
    ref: 'User',
    localField: 'submittedBy',
    foreignField: '_id',
    justOne: true
});

// Virtual for average score
SubmissionSchema.virtual('averageScore').get(function () {
    if (!this.evaluations || this.evaluations.length === 0) return 0;

    const totalScore = this.evaluations.reduce((sum, evaluation) => sum + (evaluation.totalScore || 0), 0);
    return totalScore / this.evaluations.length;
});

// Update timestamps when modified
SubmissionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // If status is changing to 'submitted', update submittedAt
    if (this.isModified('status') && this.status === 'submitted') {
        this.submittedAt = Date.now();
    }

    next();
});

// Index for search and filtering
SubmissionSchema.index({
    title: 'text',
    description: 'text',
    hackathonId: 1,
    teamId: 1,
    status: 1
});

module.exports = mongoose.model('Submission', SubmissionSchema); 