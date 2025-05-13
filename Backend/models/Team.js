const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    role: {
        type: String,
        enum: ['leader', 'member'],
        required: [true, 'Team member role is required'],
        default: 'member'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['invited', 'active', 'declined', 'removed'],
        default: 'active'
    }
});

const TeamSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },

    // Related Hackathon
    hackathonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: [true, 'Hackathon ID is required']
    },

    // Team Members
    members: [TeamMemberSchema],

    // Team Information
    projectName: {
        type: String,
        trim: true
    },
    projectDescription: {
        type: String,
        trim: true
    },
    techStack: [{
        type: String,
        trim: true
    }],

    // Team Dashboard
    isComplete: {
        type: Boolean,
        default: false
    },
    isSubmitted: {
        type: Boolean,
        default: false
    },

    // Team Status
    status: {
        type: String,
        enum: ['active', 'disqualified', 'withdrawn'],
        default: 'active'
    },

    // Payment Information
    registrationFeeAmount: {
        type: Number,
        default: 0
    },
    registrationFeePaid: {
        type: Boolean,
        default: false
    },
    paymentDetails: {
        transactionId: String,
        paymentMethod: String,
        paymentDate: Date,
        amount: Number,
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        }
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for hackathon details
TeamSchema.virtual('hackathon', {
    ref: 'Hackathon',
    localField: 'hackathonId',
    foreignField: '_id',
    justOne: true
});

// Virtual for team leader
TeamSchema.virtual('leader').get(function () {
    return this.members.find(member => member.role === 'leader');
});

// Virtual for active members count
TeamSchema.virtual('memberCount').get(function () {
    return this.members.filter(member => member.status === 'active').length;
});

// Middleware to ensure there's always a team leader
TeamSchema.pre('save', function (next) {
    // Check if there's at least one active member with leader role
    const hasLeader = this.members.some(member =>
        member.role === 'leader' && member.status === 'active'
    );

    if (!hasLeader && this.members.length > 0) {
        // If no leader and team has members, assign the first active member as leader
        const firstActiveMember = this.members.find(m => m.status === 'active');
        if (firstActiveMember) {
            firstActiveMember.role = 'leader';
        }
    }

    // Update the updatedAt timestamp
    this.updatedAt = Date.now();

    next();
});

// Middleware to validate team size against hackathon's maxTeamSize
TeamSchema.pre('save', async function (next) {
    try {
        // Only check when adding new members
        if (this.isModified('members')) {
            const activeMembers = this.members.filter(m => m.status === 'active');

            // Get the hackathon to check maxTeamSize
            const Hackathon = mongoose.model('Hackathon');
            const hackathon = await Hackathon.findById(this.hackathonId);

            if (hackathon && activeMembers.length > hackathon.maxTeamSize) {
                throw new Error(`Team exceeds maximum size of ${hackathon.maxTeamSize} members`);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Index for search and filtering
TeamSchema.index({ name: 'text', projectName: 'text', hackathonId: 1 });

module.exports = mongoose.model('Team', TeamSchema); 