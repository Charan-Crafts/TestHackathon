const mongoose = require('mongoose');

const CoOrganizerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Co-organizer name is required'],
        trim: true
    },
    contact: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    }
});

const JudgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Judge name is required'],
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
    bio: {
        type: String,
        trim: true
    }
});

const PrizeDetailSchema = new mongoose.Schema({
    place: {
        type: String,
        required: [true, 'Place is required'],
        trim: true
    },
    amount: {
        type: String,
        required: [true, 'Prize amount is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
});

const FAQSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required'],
        trim: true
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
        trim: true
    }
});

const RoundSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    id: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: [true, 'Round name is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['pre-hackathon', 'hackathon', 'post-hackathon'],
        default: 'hackathon'
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    startTime: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time in HH:MM format'],
        default: '06:00'
    },
    endTime: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time in HH:MM format'],
        default: '21:00'
    },
    activationTime: {
        type: Date
    },
    completionTime: {
        type: Date
    },
    submissionDeadline: {
        type: Date,
        validate: {
            validator: function (deadline) {
                return deadline <= this.endDate;
            },
            message: 'Submission deadline must be before or equal to round end date'
        }
    },
    platformLink: {
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'Please provide a valid URL']
    },
    submissionType: {
        type: String,
        enum: ['github', 'file', 'pdf', 'video', 'assessment'],
        default: 'github'
    },
    evaluationCriteria: [{
        name: {
            type: String,
            required: [true, 'Criteria name is required'],
            trim: true
        },
        weight: {
            type: Number,
            required: [true, 'Criteria weight is required'],
            min: [0, 'Weight cannot be negative'],
            max: [100, 'Weight cannot exceed 100']
        }
    }],
    submissions: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        submittedAt: { type: Date, default: Date.now },
        link: { type: String },
        status: { type: String, enum: ['submitted', 'reviewed', 'accepted', 'rejected'], default: 'submitted' }
    }],
    customFields: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: [true, 'Field name is required'],
            trim: true
        },
        type: {
            type: String,
            enum: ['text', 'paragraph', 'multiple_choice', 'checkbox', 'dropdown', 'file', 'date', 'time'],
            default: 'text'
        },
        required: {
            type: Boolean,
            default: false
        },
        options: [{
            type: String,
            trim: true
        }],
        order: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

// Add pre-save middleware to generate id if not provided
RoundSchema.pre('save', function (next) {
    if (!this.id) {
        this.id = `round-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

// Add methods to RoundSchema
RoundSchema.methods.activate = function () {
    this.status = 'active';
    this.isActive = true;
    this.activationTime = new Date();
    return this.save();
};

RoundSchema.methods.complete = function () {
    this.status = 'completed';
    this.isActive = false;
    this.completionTime = new Date();
    return this.save();
};

RoundSchema.methods.isPlatformLinkAccessible = function () {
    return this.status === 'active' && this.platformLink;
};

// Add virtual for time remaining
RoundSchema.virtual('timeRemaining').get(function () {
    if (!this.isActive) return null;

    const now = new Date();
    const end = new Date(this.endDate);
    const diffTime = end - now;

    if (diffTime <= 0) return 'Ended';

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
        return `${diffDays}d ${diffHours}h remaining`;
    } else {
        return `${diffHours}h ${Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))}m remaining`;
    }
});

// Add virtual for progress percentage
RoundSchema.virtual('progressPercentage').get(function () {
    if (!this.isActive) return 0;

    const now = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (now < start) return 0;
    if (now > end) return 100;

    const totalDuration = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
});

const HackathonSchema = new mongoose.Schema({
    // Basic Info
    title: {
        type: String,
        required: [true, 'Hackathon title is required'],
        trim: true
    },
    organizer: {
        type: String,
        required: [true, 'Organizer name is required'],
        trim: true
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Organizer ID is required']
    },
    description: {
        type: String,
        required: [true, 'Short description is required'],
        trim: true,
        maxlength: [300, 'Description must be at most 300 characters']
    },
    longDescription: {
        type: String,
        required: [true, 'Detailed description is required'],
        trim: true
    },
    aboutEvent: {
        type: String,
        required: [true, 'About event information is required'],
        trim: true
    },

    // Co-Organizers
    coOrganizers: [CoOrganizerSchema],

    // Dates and Location
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function (endDate) {
                return endDate > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    registrationDeadline: {
        type: Date,
        required: [true, 'Registration deadline is required'],
        validate: {
            validator: function (deadline) {
                return deadline < this.endDate;
            },
            message: 'Registration deadline must be before end date'
        }
    },
    locationType: {
        type: String,
        enum: ['online', 'offline', 'hybrid'],
        default: 'online',
        required: [true, 'Location type is required']
    },
    location: {
        type: String,
        required: [
            function () { return this.locationType === 'offline' || this.locationType === 'hybrid'; },
            'Location is required for offline or hybrid events'
        ],
        trim: true
    },

    // Images
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: [true, 'Hackathon image is required']
    },

    // Status and Categories
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true,
        // 'pending' when created by organizer, 'approved' or 'rejected' set by admin
    },
    category: {
        type: String,
        required: [true, 'Primary category is required'],
        trim: true
    },
    technology: [{
        type: String,
        trim: true
    }],

    // Participation Details
    maxTeamSize: {
        type: Number,
        default: 4,
        min: [1, 'Maximum team size must be at least 1']
    },
    participants: {
        type: Number,
        default: 0,
        min: [0, 'Participants count cannot be negative']
    },
    prize: {
        type: String,
        required: [true, 'Total prize amount is required'],
        trim: true
    },
    registrationFees: {
        type: Map,
        of: Number,
        default: new Map([['1', 0]]) // Default zero fee for individual participants
    },

    // Details
    eligibility: [{
        type: String,
        trim: true
    }],
    rules: {
        type: String,
        trim: true
    },
    submissionRequirements: {
        type: String,
        trim: true
    },
    judgingCriteria: [{
        type: String,
        trim: true
    }],

    // Timeline/Rounds
    rounds: [RoundSchema],

    // Prizes Details
    prizeDetails: [PrizeDetailSchema],

    // Judges
    judges: [JudgeSchema],

    // FAQ
    faqs: [FAQSchema],

    // Terms & Conditions
    termsAccepted: {
        type: Boolean,
        default: false,
        validate: {
            validator: function (value) {
                return value === true;
            },
            message: 'You must accept the terms and conditions'
        }
    },

    // Approval Status
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectionReason: {
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
    },

    // Stats
    viewCount: {
        type: Number,
        default: 0
    },
    registrationCount: {
        type: Number,
        default: 0
    },
    submissionCount: {
        type: Number,
        default: 0
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for imageFile
HackathonSchema.virtual('imageFile', {
    ref: 'File',
    localField: 'image',
    foreignField: '_id',
    justOne: true
});

// Virtual for formatted dates
HackathonSchema.virtual('dates').get(function () {
    if (!this.startDate || !this.endDate) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return `${formatDate(this.startDate)} - ${formatDate(this.endDate)}`;
});

// Middleware to update updatedAt timestamp
HackathonSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for search
HackathonSchema.index({
    title: 'text',
    description: 'text',
    category: 'text',
    'technology': 'text'
});

module.exports = mongoose.model('Hackathon', HackathonSchema); 