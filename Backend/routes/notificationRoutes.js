const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    handleTeamResponse
} = require('../controllers/notificationController');

// Get all notifications for the current user
router.get('/', protect, getMyNotifications);

// Mark a notification as read
router.put('/:id/read', protect, markAsRead);

// Mark all notifications as read
router.put('/mark-all-read', protect, markAllAsRead);

// Handle team join request response (accept/reject)
router.put('/:id/respond', protect, handleTeamResponse);

module.exports = router;
