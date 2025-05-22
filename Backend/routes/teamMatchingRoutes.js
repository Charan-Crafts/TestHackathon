const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getParticipantsLookingForTeam,
    updateTeamPreferences,
    getTeamSuggestions,
    getAllParticipantsLookingForTeam
} = require('../controllers/teamMatchingController');

// Get all participants looking for team across all hackathons
router.get('/looking-for-team', protect, getAllParticipantsLookingForTeam);

// Get participants looking for team in a specific hackathon
router.get('/looking-for-team/:hackathonId', protect, getParticipantsLookingForTeam);

// Update participant's team preferences
router.put('/preferences/:registrationId', protect, updateTeamPreferences);

// Get team suggestions based on skills and preferences
router.get('/suggestions/:hackathonId', protect, getTeamSuggestions);

module.exports = router; 