const express = require('express');
const {
    submitVerificationRequest,
    uploadVerificationProofs,
    getMyVerification,
    getVerificationRequests,
    getVerificationRequest,
    reviewVerificationRequest,
    getVerificationStatus
} = require('../controllers/verificationController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const { uploadMultipleFiles, uploadFields } = require('../middleware/fileUpload');

const router = express.Router();

// User routes
router.post('/', protect, submitVerificationRequest);
router.post(
    '/upload-proofs',
    protect,
    uploadFields([
        { name: 'photoIdProof', maxCount: 1 },
        { name: 'organizationIdProof', maxCount: 1 }
    ]),
    uploadVerificationProofs
);
router.get('/me', protect, getMyVerification);

// Admin routes
router.get('/', protect, authorize('admin'), getVerificationRequests);
router.get('/:id', protect, authorize('admin'), getVerificationRequest);
router.put('/:id/review', protect, authorize('admin'), reviewVerificationRequest);

// Route for checking the verification status of the current user
router.get('/status', protect, getVerificationStatus);

module.exports = router; 