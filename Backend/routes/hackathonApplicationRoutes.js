const express = require('express');
const {
    submitApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
    reviewApplication,
    getMyApplications
} = require('../controllers/hackathonApplicationController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes (with optional authentication)
router.post('/', submitApplication);

// User routes
router.get('/my-applications', protect, getMyApplications);
router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

// Admin routes
router.get('/', protect, authorize('admin'), getApplications);
router.get('/:id', protect, getApplication); // Access controlled in controller
router.put('/:id/review', protect, authorize('admin'), reviewApplication);

module.exports = router; 