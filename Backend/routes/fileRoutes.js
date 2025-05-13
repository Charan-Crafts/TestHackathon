const express = require('express');
const {
    uploadFile,
    uploadMultipleFiles,
    getFile,
    getFilesByEntity,
    deleteFile,
    uploadProfileImage,
    uploadEntityDocuments,
    getFileById
} = require('../controllers/fileController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const { uploadSingleFile, uploadMultipleFiles: uploadMultiple } = require('../middleware/fileUpload');

const router = express.Router();

// Basic file operations
router.post('/upload', protect, uploadSingleFile('file'), uploadFile);
router.post('/upload-multiple', protect, uploadMultiple('files', 5), uploadMultipleFiles);
router.get('/id/:id', getFileById);
router.get('/:filename', getFile); // Can be accessed without authentication
router.delete('/:id', protect, deleteFile);

// Get files for an entity
router.get('/entity/:entityType/:entityId', protect, getFilesByEntity);

// Specialized upload routes
router.post('/profile-image', protect, uploadSingleFile('image'), uploadProfileImage);
router.post('/documents/:entityType/:entityId', protect, uploadMultiple('documents', 10), uploadEntityDocuments);

// Admin routes
router.post(
    '/admin-documents',
    protect,
    authorize('admin', 'organizer'),
    uploadMultiple('documents', 20),
    uploadMultipleFiles
);

module.exports = router; 