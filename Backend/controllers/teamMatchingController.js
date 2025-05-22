const Registration = require('../models/Registration');
const Hackathon = require('../models/Hackathon');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all participants looking for team in a specific hackathon
 * @route   GET /api/team-matching/looking-for-team/:hackathonId
 * @access  Private
 */
exports.getParticipantsLookingForTeam = asyncHandler(async (req, res) => {
    const { hackathonId } = req.params;

    // Verify hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
        return res.status(404).json({
            success: false,
            message: 'Hackathon not found'
        });
    }

    // Find all registrations for this hackathon where lookingForTeam is true
    const participants = await Registration.find({
        hackathonId,
        'teamInfo.lookingForTeam': true,
        // status: 'approved' Only show approved registrations
    })
        .populate('userId', 'firstName lastName email avatar')
        .populate('hackathonId', 'title description imagePath maxTeamSize')
        .select('personalInfo professionalInfo teamInfo createdAt');

    // Format the response
    const formattedParticipants = participants.map(participant => ({
        id: participant._id,
        user: {
            id: participant.userId._id,
            firstName: participant.userId.firstName,
            lastName: participant.userId.lastName,
            email: participant.userId.email,
            avatar: participant.userId.avatar
        },
        hackathon: {
            id: participant.hackathonId._id,
            title: participant.hackathonId.title,
            description: participant.hackathonId.description,
            imagePath: participant.hackathonId.imagePath,
            maxTeamSize: participant.hackathonId.maxTeamSize
        },
        personalInfo: {
            firstName: participant.personalInfo.firstName,
            lastName: participant.personalInfo.lastName,
            email: participant.personalInfo.email,
            phone: participant.personalInfo.phone
        },
        professionalInfo: {
            role: participant.professionalInfo.role,
            experience: participant.professionalInfo.experience,
            skills: participant.professionalInfo.skills,
            github: participant.professionalInfo.github,
            portfolio: participant.professionalInfo.portfolio
        },
        teamPreferences: {
            teamSize: participant.teamInfo.teamSize,
            lookingForRoles: participant.teamInfo.lookingForRoles || [],
            preferredTechnologies: participant.professionalInfo.skills || []
        },
        registeredAt: participant.createdAt
    }));

    res.status(200).json({
        success: true,
        count: formattedParticipants.length,
        data: formattedParticipants
    });
});

/**
 * @desc    Update participant's team preferences
 * @route   PUT /api/team-matching/preferences/:registrationId
 * @access  Private
 */
exports.updateTeamPreferences = asyncHandler(async (req, res) => {
    const { registrationId } = req.params;
    const { teamSize, lookingForRoles, preferredTechnologies } = req.body;

    const registration = await Registration.findById(registrationId);

    if (!registration) {
        return res.status(404).json({
            success: false,
            message: 'Registration not found'
        });
    }

    // Verify user owns this registration
    if (registration.userId.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update these preferences'
        });
    }

    registration.teamInfo.teamSize = teamSize || registration.teamInfo.teamSize;
    registration.teamInfo.lookingForRoles = lookingForRoles || registration.teamInfo.lookingForRoles;
    registration.professionalInfo.skills = preferredTechnologies || registration.professionalInfo.skills;

    await registration.save();

    res.status(200).json({
        success: true,
        data: registration
    });
});

/**
 * @desc    Get team suggestions based on skills and preferences
 * @route   GET /api/team-matching/suggestions/:hackathonId
 * @access  Private
 */
exports.getTeamSuggestions = asyncHandler(async (req, res) => {
    const { hackathonId } = req.params;

    // Get user's registration
    const userRegistration = await Registration.findOne({
        hackathonId,
        userId: req.user.id
    }).select('professionalInfo teamInfo');

    if (!userRegistration) {
        return res.status(404).json({
            success: false,
            message: 'You are not registered for this hackathon'
        });
    }

    // Find participants with complementary skills
    const suggestions = await Registration.find({
        hackathonId,
        'teamInfo.lookingForTeam': true,
        userId: { $ne: req.user.id }, // Exclude current user
        status: 'approved'
    })
        .populate('userId', 'firstName lastName email avatar')
        .select('personalInfo professionalInfo teamInfo');

    // Score and sort suggestions based on skill compatibility
    const scoredSuggestions = suggestions.map(suggestion => {
        const skillMatch = suggestion.professionalInfo.skills.filter(
            skill => userRegistration.professionalInfo.skills.includes(skill)
        ).length;

        return {
            ...suggestion.toObject(),
            compatibilityScore: skillMatch
        };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.status(200).json({
        success: true,
        count: scoredSuggestions.length,
        data: scoredSuggestions
    });
});

/**
 * @desc    Get all participants looking for team across all hackathons
 * @route   GET /api/team-matching/looking-for-team
 * @access  Private
 */
exports.getAllParticipantsLookingForTeam = asyncHandler(async (req, res) => {
    // Find all registrations where lookingForTeam is true
    const participants = await Registration.find({
        'teamInfo.lookingForTeam': true,
        status: 'approved' // Only show approved registrations
    })
        .populate('userId', 'firstName lastName email avatar')
        .populate('hackathonId', 'title description imagePath maxTeamSize')
        .select('personalInfo professionalInfo teamInfo createdAt');

    // Format the response
    const formattedParticipants = participants.map(participant => ({
        id: participant._id,
        user: {
            id: participant.userId._id,
            firstName: participant.userId.firstName,
            lastName: participant.userId.lastName,
            email: participant.userId.email,
            avatar: participant.userId.avatar
        },
        hackathon: {
            id: participant.hackathonId._id,
            title: participant.hackathonId.title,
            description: participant.hackathonId.description,
            imagePath: participant.hackathonId.imagePath,
            maxTeamSize: participant.hackathonId.maxTeamSize
        },
        personalInfo: {
            firstName: participant.personalInfo.firstName,
            lastName: participant.personalInfo.lastName,
            email: participant.personalInfo.email,
            phone: participant.personalInfo.phone
        },
        professionalInfo: {
            role: participant.professionalInfo.role,
            experience: participant.professionalInfo.experience,
            skills: participant.professionalInfo.skills,
            github: participant.professionalInfo.github,
            portfolio: participant.professionalInfo.portfolio
        },
        teamPreferences: {
            teamSize: participant.teamInfo.teamSize,
            lookingForRoles: participant.teamInfo.lookingForRoles || [],
            preferredTechnologies: participant.professionalInfo.skills || []
        },
        registeredAt: participant.createdAt
    }));

    res.status(200).json({
        success: true,
        count: formattedParticipants.length,
        data: formattedParticipants
    });
}); 