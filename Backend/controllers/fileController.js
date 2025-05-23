const ErrorResponse = require('../utils/errorResponse');
const File = require('../models/File');
const { deleteFromS3, getSignedUrl } = require('../config/s3Config');

// @desc    Upload a single file
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorResponse('Please upload a file', 400));
        }

        // Create a new file record
        const file = await File.create({
            fileName: req.file.key, // Using S3 key instead of filename
            originalName: req.file.originalname,
            filePath: req.file.location, // Using S3 URL instead of local path
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            uploadedBy: req.user.id,
            entityType: req.body.entityType || 'other',
            entityId: req.body.entityId,
            isPublic: req.body.isPublic === 'true' || req.body.isPublic === true,
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
            s3Key: req.file.key,
            s3Bucket: req.file.bucket
        });

        res.status(201).json({
            success: true,
            data: file
        });
    } catch (err) {
        console.error('File upload error:', err);
        next(err);
    }
};

// @desc    Upload multiple files
// @route   POST /api/files/upload-multiple
// @access  Private
exports.uploadMultipleFiles = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next(new ErrorResponse('Please upload at least one file', 400));
        }

        // Create file records for each uploaded file
        const filePromises = req.files.map(file => {
            return File.create({
                fileName: file.key, // Using S3 key instead of filename
                originalName: file.originalname,
                filePath: file.location, // Using S3 URL instead of local path
                fileSize: file.size,
                fileType: file.mimetype,
                uploadedBy: req.user.id,
                entityType: req.body.entityType || 'other',
                entityId: req.body.entityId,
                isPublic: req.body.isPublic === 'true' || req.body.isPublic === true,
                tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
                s3Key: file.key,
                s3Bucket: file.bucket
            });
        });

        const files = await Promise.all(filePromises);

        res.status(201).json({
            success: true,
            count: files.length,
            data: files
        });
    } catch (err) {
        console.error('Multiple file upload error:', err);
        next(err);
    }
};

// @desc    Get a file by filename
// @route   GET /api/files/:filename
// @access  Public or Private (depends on implementation)
exports.getFile = async (req, res, next) => {
    try {
        const filename = req.params.filename;

        // Find the file in the database
        const file = await File.findOne({ fileName: filename });

        if (!file) {
            return next(new ErrorResponse('File not found in database', 404));
        }

        // If file is private, check if user is authorized
        if (!file.isPublic && (!req.user || req.user.id.toString() !== file.uploadedBy.toString())) {
            return next(new ErrorResponse('Not authorized to access this file', 403));
        }

        // Generate a signed URL for temporary access
        const signedUrl = await getSignedUrl(file.s3Key);

        res.json({
            success: true,
            data: {
                ...file.toObject(),
                signedUrl
            }
        });
    } catch (err) {
        console.error('Get file error:', err);
        next(err);
    }
};

// @desc    Get files by entity ID
// @route   GET /api/files/entity/:entityType/:entityId
// @access  Private
exports.getFilesByEntity = async (req, res, next) => {
    try {
        const { entityType, entityId } = req.params;

        // Find all files for this entity
        const files = await File.find({
            entityType,
            entityId
        });

        // Generate signed URLs for all files
        const filesWithUrls = await Promise.all(files.map(async (file) => {
            const signedUrl = await getSignedUrl(file.s3Key);
            return {
                ...file.toObject(),
                signedUrl
            };
        }));

        res.status(200).json({
            success: true,
            count: files.length,
            data: filesWithUrls
        });
    } catch (err) {
        console.error('Get files by entity error:', err);
        next(err);
    }
};

// @desc    Delete a file by ID
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return next(new ErrorResponse('File not found', 404));
        }

        // Check if user owns the file or is admin
        if (file.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to delete this file', 403));
        }

        // Delete from S3
        await deleteFromS3(file.s3Key);

        // Delete the database record
        await file.remove();

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (err) {
        console.error('Delete file error:', err);
        next(err);
    }
};

// @desc    Upload a profile image
// @route   POST /api/files/profile-image
// @access  Private
exports.uploadProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorResponse('Please upload an image', 400));
        }

        // Validate that it's an image
        if (!req.file.mimetype.startsWith('image')) {
            return next(new ErrorResponse('Please upload an image file', 400));
        }

        // Create a new file record
        const file = await File.create({
            fileName: req.file.key,
            originalName: req.file.originalname,
            filePath: req.file.location,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            uploadedBy: req.user.id,
            entityType: 'user',
            entityId: req.user.id,
            isPublic: true,
            tags: ['profile', 'image'],
            s3Key: req.file.key,
            s3Bucket: req.file.bucket
        });

        // Here you would typically update the user's profile with the new image URL
        // For example: 
        // const User = require('../models/User');
        // await User.findByIdAndUpdate(req.user.id, { profileImage: file.filePath });

        res.status(201).json({
            success: true,
            data: file
        });
    } catch (err) {
        console.error('Profile image upload error:', err);
        next(err);
    }
};

// @desc    Upload documents for a specific entity
// @route   POST /api/files/documents/:entityType/:entityId
// @access  Private
exports.uploadEntityDocuments = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next(new ErrorResponse('Please upload at least one document', 400));
        }

        const { entityType, entityId } = req.params;

        // Create file records for each uploaded file
        const filePromises = req.files.map(file => {
            return File.create({
                fileName: file.key,
                originalName: file.originalname,
                filePath: file.location,
                fileSize: file.size,
                fileType: file.mimetype,
                uploadedBy: req.user.id,
                entityType,
                entityId,
                isPublic: req.body.isPublic === 'true' || req.body.isPublic === true,
                tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
                s3Key: file.key,
                s3Bucket: file.bucket
            });
        });

        const files = await Promise.all(filePromises);

        res.status(201).json({
            success: true,
            count: files.length,
            data: files
        });
    } catch (err) {
        console.error('Entity documents upload error:', err);
        next(err);
    }
};

// @desc    Get file metadata by MongoDB ID
// @route   GET /api/files/id/:id
// @access  Public
exports.getFileById = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ success: false, error: 'File not found in database' });
        }

        // Generate a signed URL if the file exists
        const signedUrl = await getSignedUrl(file.s3Key);

        res.json({
            success: true,
            data: {
                ...file.toObject(),
                signedUrl
            }
        });
    } catch (err) {
        next(err);
    }
}; 