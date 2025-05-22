const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['TEAM_JOIN_REQUEST', 'TEAM_REQUEST_ACCEPTED', 'TEAM_REQUEST_REJECTED'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    read: {
        type: Boolean,
        default: false
    },
    metadata: {
        teamId: String,
        hackathonId: String,
        userId: String,
        registrationId: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
