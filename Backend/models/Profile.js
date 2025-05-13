const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Professional Information
    title: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    resume: {
        type: String, // URL or path to the resume file
        trim: true
    },
    // Social Media Links
    socials: [{
        name: {
            type: String,
            required: true,
            enum: ['GitHub', 'LinkedIn', 'Twitter', 'Portfolio', 'Other']
        },
        url: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    }],
    // Education History
    education: [{
        id: {
            type: Number,
            required: true
        },
        institution: {
            type: String,
            required: true
        },
        degree: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        logo: {
            type: String
        }
    }],
    // Work Experience
    experience: [{
        id: {
            type: Number,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        logo: {
            type: String
        }
    }],
    // Skills
    skills: [{
        name: {
            type: String,
            required: true
        },
        proficiency: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        category: {
            type: String,
            required: true,
            enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'other']
        }
    }],
    // Certifications
    certifications: [{
        name: {
            type: String,
            required: true
        },
        issuer: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        file: {
            type: String // URL or path to the certificate file
        }
    }],
    // Achievements
    achievements: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        file: {
            type: String // URL or path to the achievement proof file
        }
    }],
    // Stats
    stats: {
        projects: {
            type: Number,
            default: 0
        },
        hackathons: {
            type: Number,
            default: 0
        },
        challenges: {
            type: Number,
            default: 0
        },
        streak: {
            type: Number,
            default: 0
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
});

// Update the updatedAt timestamp before saving
ProfileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Profile', ProfileSchema); 