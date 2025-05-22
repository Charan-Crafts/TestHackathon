const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    hackathonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teamId: {
        type: String,
        unique: true,
        sparse: true
    },
    // Student eligibility criteria fields
    studentBranches: [String], // e.g., ['CSE', 'ECE']
    studentMinPercentage: Number, // e.g., 60
    personalInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String }
    },
    professionalInfo: {
        role: String,
        experience: String,
        skills: [String],
        github: String,
        portfolio: String
    },
    teamInfo: {
        teamName: String,
        teamSize: {
            type: Number,
            validate: {
                validator: async function (value) {
                    if (!value) return true; // Skip validation if no team size
                    const hackathon = await mongoose.model('Hackathon').findById(this.hackathonId);
                    return value <= hackathon.maxTeamSize;
                },
                message: props => `Team size ${props.value} exceeds hackathon's maximum team size!`
            }
        },
        currentTeamSize: {
            type: Number,
            default: 1
        },
        lookingForTeam: Boolean,
        isTeamLeader: {
            type: Boolean,
            default: false
        },
        teammates: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            role: {
                type: String,
                enum: ['leader', 'member'],
                required: true
            },
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }],
        joinRequests: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            status: {
                type: String,
                enum: ['pending', 'accepted', 'rejected'],
                default: 'pending'
            },
            requestedAt: {
                type: Date,
                default: Date.now
            },
            responseAt: Date,
            message: String
        }]
    },
    projectInfo: {
        projectTitle: String,
        projectDescription: String,
        techStack: [String],
        category: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    }
}, { timestamps: true });

// Pre-save middleware to handle team creation
RegistrationSchema.pre('save', async function (next) {
    if (this.isNew && this.teamInfo && this.teamInfo.teamName) {
        // If this is a new registration with team info, make the user team leader
        this.teamInfo.isTeamLeader = true;
        this.teamInfo.teammates = [{
            userId: this.userId,
            role: 'leader',
            joinedAt: new Date()
        }];

        // Generate unique teamId
        this.teamId = `TEAM-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase();
    }

    // Update currentTeamSize based on teammates array
    if (this.teamInfo && this.teamInfo.teammates) {
        this.teamInfo.currentTeamSize = this.teamInfo.teammates.length;
    }
    next();
});

// Method to check if team is full
RegistrationSchema.methods.isTeamFull = async function () {
    if (!this.teamInfo || !this.teamInfo.teamSize) return false;
    return this.teamInfo.currentTeamSize >= this.teamInfo.teamSize;
};

module.exports = mongoose.model('Registration', RegistrationSchema); 