const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createTeam,
    getTeamDetails,
    requestToJoinTeam,
    handleJoinRequest,
    leaveTeam,
    updateTeamDetails,
    getAllTeams,
    getUserTeams,
    checkTeamRole,
    inviteTeamMember,
    acceptTeamInvitation,
    rejectTeamInvitation,
    getAvailableUsers,
    sendJoinRequest,
    getJoinRequests,
    respondToJoinRequest
} = require('../controllers/teamController');

// Get all teams
router.get('/', protect, getAllTeams);

// Get user teams
router.get('/user/:userId', protect, getUserTeams);

// Check team role for a specific hackathon
router.get('/role/:hackathonId', protect, checkTeamRole);

// Get available users for team formation
router.get('/available-users/:hackathonId', protect, getAvailableUsers);

// Join request routes
router.get('/join-requests/:hackathonId', protect, getJoinRequests);
router.post('/join-request/:hackathonId/:teamId', protect, sendJoinRequest);
router.put('/join-request/:requestId/respond', protect, respondToJoinRequest);

// Team routes
router.post('/', protect, createTeam);
router.get('/:teamId', protect, getTeamDetails);
router.post('/:teamId/request', protect, requestToJoinTeam);
router.put('/:teamId/request/:userId', protect, handleJoinRequest);
router.post('/:teamId/leave', protect, leaveTeam);
router.put('/:teamId', protect, updateTeamDetails);

// New routes for team formation
router.post('/:teamId/invite', protect, inviteTeamMember);
router.post('/:teamId/invitation/accept', protect, acceptTeamInvitation);
router.post('/:teamId/invitation/reject', protect, rejectTeamInvitation);

module.exports = router;