const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getOrganizerSubmissions,
    getHackathonSubmissions,
    getOrganizerSubmissionStats,
    getSubmissionById,
    getTestLinkUUID
} = require('../controllers/submissionController');

// Protect all routes
router.use(protect);

// Organizer routes
router.get('/organizer', authorize('organizer'), getOrganizerSubmissions);
router.get('/organizer/stats', authorize('organizer'), getOrganizerSubmissionStats);
router.get('/hackathon/:hackathonId', authorize('organizer'), getHackathonSubmissions);
router.get('/:submissionId', authorize('organizer'), getSubmissionById);
router.get('/test-link/:submissionId', authorize('organizer'), getTestLinkUUID);

module.exports = router; 