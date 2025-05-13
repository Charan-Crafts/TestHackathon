const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
        trim: true,
    },
    originalName: {
        type: String,
        required: true,
        trim: true,
    },
    filePath: {
        type: String,
        required: true,
        trim: true,
    },
    fileUrl: {
        type: String,
        required: true,
        trim: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
        trim: true,
    },
    entityType: {
        type: String,
        enum: ['user', 'hackathon', 'submission', 'project', 'other'],
        default: 'other',
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This can be dynamic and refer to different models
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Set toJSON and toObject options
FileSchema.set('toJSON', { virtuals: true });
FileSchema.set('toObject', { virtuals: true });

// Pre-remove middleware for S3 file deletion
FileSchema.pre('remove', async function (next) {
    try {
        const { s3, BUCKET_NAME } = require('../config/s3Config');
        await s3.deleteObject({
            Bucket: BUCKET_NAME,
            Key: this.filePath
        }).promise();
        next();
    } catch (err) {
        console.error('Error deleting file from S3:', err);
        next(err);
    }
});

module.exports = mongoose.model('File', FileSchema); 