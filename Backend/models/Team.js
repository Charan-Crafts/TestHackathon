const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
});

const TeamSchema = new mongoose.Schema({
    hackathonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hackathon',
        required: true
    },
    teamId: {
        type: String,
        unique: true,
        required: true
    },
    teamName: {
        type: String,
        required: true,
        trim: true
    },
    teamLeaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    maxTeamSize: {
        type: Number,
        required: true
    },
    currentTeamSize: {
        type: Number,
        default: 1
    },
    members: [TeamMemberSchema],
    lookingForRoles: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['forming', 'complete', 'locked'],
        default: 'forming'
    }
}, { timestamps: true });

// Pre-save middleware to generate teamId
TeamSchema.pre('save', function (next) {
    if (this.isNew && !this.teamId) {
        this.teamId = `TEAM-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`.toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Team', TeamSchema); 