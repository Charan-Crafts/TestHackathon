const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: [true, 'Please add a file name']
    },
    originalName: {
        type: String,
        required: [true, 'Please add original file name']
    },
    filePath: {
        type: String,
        required: [true, 'Please add a file path']
    },
    fileSize: {
        type: Number,
        required: [true, 'Please add file size']
    },
    fileType: {
        type: String,
        required: [true, 'Please add file type']
    },
    uploadedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true

    },
    entityType: {
        type: String,
        required: [true, 'Please specify the entity type'],
        enum: ['user', 'hackathon', 'project', 'submission', 'other']
    },
    entityId: {
        type: String,
        required: [true, 'Please specify the entity ID']
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        default: []
    },
    s3Key: {
        type: String,
        required: [true, 'Please add S3 key']
    },
    s3Bucket: {
        type: String,
        required: [true, 'Please add S3 bucket name']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create indexes
FileSchema.index({ entityType: 1, entityId: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ tags: 1 });
FileSchema.index({ fileName: 1 });

// File URL virtual property
FileSchema.virtual('fileUrl').get(function () {
    // Always use the same base URL for serving images
    // You can adjust this if deploying elsewhere
    return `/uploads/${this.fileName}`;
});

// Set virtuals when converting to JSON
FileSchema.set('toJSON', { virtuals: true });
FileSchema.set('toObject', { virtuals: true });

// Deleting the physical file before deleting the document
FileSchema.pre('remove', async function (next) {
    try {
        const fs = require('fs');
        if (fs.existsSync(this.filePath)) {
            fs.unlinkSync(this.filePath);
        }
        next();
    } catch (err) {
        console.error('Error deleting file:', err);
        next(err);
    }
});

module.exports = mongoose.model('File', FileSchema); 