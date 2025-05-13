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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    personalInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String }  // Changed from required to optional
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
        teamSize: String,
        lookingForTeam: Boolean,
        teammates: [String]
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
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Registration', RegistrationSchema); 