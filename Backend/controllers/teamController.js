const Team = require('../models/Team');
const Registration = require('../models/Registration');
const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { createNotification } = require('./notificationController');

// Create a new team
exports.createTeam = asyncHandler(async (req, res) => {
    const { hackathonId, teamName, lookingForRoles, description, techStack } = req.body;

    // Verify hackathon exists and get maxTeamSize
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
        return res.status(404).json({
            success: false,
            message: 'Hackathon not found'
        });
    }

    // Check if user is already in a team for this hackathon
    const existingTeamMembership = await Team.findOne({
        hackathonId,
        'members.userId': req.user.id
    });

    if (existingTeamMembership) {
        return res.status(400).json({
            success: false,
            message: 'You are already part of a team in this hackathon'
        });
    }

    // Create new team
    const team = await Team.create({
        hackathonId,
        teamName,
        teamLeaderId: req.user.id,
        maxTeamSize: hackathon.maxTeamSize,
        currentTeamSize: 1,
        members: [{
            userId: req.user.id,
            role: 'leader',
            joinedAt: new Date()
        }],
        lookingForRoles,
        description,
        techStack
    });

    // Update user's registration
    await Registration.findOneAndUpdate(
        { hackathonId, userId: req.user.id },
        {
            teamId: team._id,
            isTeamLead: true,
            lookingForTeam: false
        }
    );

    res.status(201).json({
        success: true,
        data: team
    });
});

// Get team details
exports.getTeamDetails = asyncHandler(async (req, res) => {
    const { teamId } = req.params;

    const team = await Team.findById(teamId)
        .populate('members.userId', 'firstName lastName email avatar skills')
        .populate('teamLeaderId', 'firstName lastName email avatar')
        .populate('hackathonId', 'name startDate endDate');

    if (!team) {
        return res.status(404).json({
            success: false,
            message: 'Team not found'
        });
    }

    res.status(200).json({
        success: true,
        data: team
    });
});

// Join team
exports.joinTeam = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { role } = req.body;

    // Find the team's registration
    const teamRegistration = await Registration.findOne({ teamId });
    if (!teamRegistration) {
        return res.status(404).json({
            success: false,
            message: 'Team not found'
        });
    }

    // Check if team is full
    if (teamRegistration.teamInfo.currentTeamSize >= teamRegistration.teamInfo.teamSize) {
        return res.status(400).json({
            success: false,
            message: 'Team is already full'
        });
    }

    // Check if user is already in a team for this hackathon
    const existingTeamMembership = await Registration.findOne({
        hackathonId: teamRegistration.hackathonId,
        $or: [
            { 'teamInfo.teammates.userId': req.user.id },
            { userId: req.user.id, teamId: { $exists: true } }
        ]
    }).populate('teamInfo.teammates.userId', 'firstName lastName');

    if (existingTeamMembership) {
        let teamName = existingTeamMembership.teamInfo?.teamName || 'Unknown Team';
        return res.status(400).json({
            success: false,
            message: `You are already part of team "${teamName}" in this hackathon. Please leave your current team before joining a new one.`,
            currentTeam: {
                teamName: teamName,
                teamSize: existingTeamMembership.teamInfo?.teamSize,
                currentTeamSize: existingTeamMembership.teamInfo?.currentTeamSize,
                teammates: existingTeamMembership.teamInfo?.teammates
            }
        });
    }

    // First, find or create the user's registration
    let userRegistration = await Registration.findOne({
        hackathonId: teamRegistration.hackathonId,
        userId: req.user.id
    });

    if (!userRegistration) {
        // Create new registration for the user
        userRegistration = new Registration({
            hackathonId: teamRegistration.hackathonId,
            userId: req.user.id,
            status: 'pending',
            teamInfo: {
                teamName: teamRegistration.teamInfo.teamName,
                teamSize: teamRegistration.teamInfo.teamSize,
                currentTeamSize: teamRegistration.teamInfo.currentTeamSize,
                isTeamLeader: false,
                lookingForTeam: false,
                teammates: [{
                    userId: req.user.id,
                    role: role || 'member',
                    joinedAt: new Date()
                }]
            }
        });
    } else {
        // Update existing registration
        userRegistration.teamInfo = {
            teamName: teamRegistration.teamInfo.teamName,
            teamSize: teamRegistration.teamInfo.teamSize,
            currentTeamSize: teamRegistration.teamInfo.currentTeamSize,
            isTeamLeader: false,
            lookingForTeam: false,
            teammates: [{
                userId: req.user.id,
                role: role || 'member',
                joinedAt: new Date()
            }]
        };
        userRegistration.status = 'pending';
    }

    // Add member to team registration
    teamRegistration.teamInfo.teammates.push({
        userId: req.user.id,
        role: role || 'member',
        joinedAt: new Date()
    });
    teamRegistration.teamInfo.currentTeamSize = teamRegistration.teamInfo.teammates.length;

    // If team is now full, update lookingForTeam status
    if (teamRegistration.teamInfo.currentTeamSize >= teamRegistration.teamInfo.teamSize) {
        teamRegistration.teamInfo.lookingForTeam = false;
    }

    // Save both registrations
    await Promise.all([
        teamRegistration.save(),
        userRegistration.save()
    ]);

    // Populate the response data
    const populatedTeam = await Registration.findOne({ teamId })
        .populate('userId', 'firstName lastName email avatar')
        .populate('teamInfo.teammates.userId', 'firstName lastName email avatar')
        .populate('hackathonId');

    res.status(200).json({
        success: true,
        data: populatedTeam
    });
});

// Leave team
exports.leaveTeam = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const userId = req.user.id;

    // Find all registrations for this team
    const teamRegistrations = await Registration.find({ teamId });
    if (!teamRegistrations || teamRegistrations.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Team not found'
        });
    }

    // Check if user is in the team and not the leader
    const userReg = teamRegistrations.find(reg =>
        reg.teamInfo.teammates.some(member => member.userId.toString() === userId)
    );
    if (!userReg) {
        return res.status(400).json({
            success: false,
            message: 'You are not a member of this team'
        });
    }
    const userInTeam = userReg.teamInfo.teammates.find(member => member.userId.toString() === userId);
    if (userInTeam.role === 'leader') {
        return res.status(400).json({
            success: false,
            message: 'Team leader cannot leave the team. Please transfer leadership or delete the team.'
        });
    }

    // Remove user from teammates in all registrations, with debug logging
    for (const reg of teamRegistrations) {
        reg.teamInfo.teammates.forEach(member => {
            console.log('Comparing:', member.userId, typeof member.userId, 'to', userId, typeof userId, '->', member.userId.toString() === userId.toString());
        });
        reg.teamInfo.teammates = reg.teamInfo.teammates.filter(
            member => member.userId.toString() !== userId.toString()
        );
        console.log('After update:', reg.userId.toString(), reg.teamInfo.teammates.map(t => t.userId.toString()));
        reg.teamInfo.currentTeamSize = reg.teamInfo.teammates.length;
        reg.teamInfo.lookingForTeam = true;
        await reg.save();
    }

    // Update the user's own registration to clear team info
    const userRegistration = await Registration.findOne({
        hackathonId: userReg.hackathonId,
        userId: userId
    });
    if (userRegistration) {
        userRegistration.teamInfo = {
            teamName: '',
            teamSize: 0,
            currentTeamSize: 0,
            isTeamLeader: false,
            lookingForTeam: true,
            teammates: []
        };
        await userRegistration.save();
        // Delete the registration if the user is no longer in any team
        if (
            !userRegistration.teamInfo.teamName &&
            !userRegistration.teamInfo.isTeamLeader &&
            (!userRegistration.teamInfo.teammates || userRegistration.teamInfo.teammates.length === 0)
        ) {
            await userRegistration.deleteOne();
        }
    }

    res.status(200).json({
        success: true,
        message: 'Successfully left the team'
    });
});

// Update team details
exports.updateTeamDetails = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { teamName, description, lookingForRoles, techStack } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({
            success: false,
            message: 'Team not found'
        });
    }

    // Verify user is team leader
    if (team.teamLeaderId.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Only team leader can update team details'
        });
    }

    team.teamName = teamName || team.teamName;
    team.description = description || team.description;
    team.lookingForRoles = lookingForRoles || team.lookingForRoles;
    team.techStack = techStack || team.techStack;

    await team.save();

    res.status(200).json({
        success: true,
        data: team
    });
});

// Request to join team
exports.requestToJoinTeam = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { message } = req.body;

    console.log('Processing join request for team:', teamId);

    // Find the team's registration using teamId field
    const teamRegistration = await Registration.findOne({ teamId })
        .populate('teamInfo.teammates.userId', 'firstName lastName email')
        .populate('teamInfo.joinRequests.userId', 'firstName lastName email');

    if (!teamRegistration) {
        console.error('Team not found:', teamId);
        return res.status(404).json({
            success: false,
            message: 'Team not found'
        });
    }

    // Create notification for team leader
    const teamLeader = teamRegistration.teamInfo.teammates.find(member => member.role === 'leader');
    if (teamLeader) {
        console.log('Creating notification for team leader:', teamLeader.userId);
        try {
            // Fetch user details for the notification message
            const user = await User.findById(req.user.id);
            const userName = user ? `${user.firstName} ${user.lastName}` : 'A user';
            const userEmail = user ? user.email : '';
            const notification = await createNotification(
                teamLeader.userId,
                'TEAM_JOIN_REQUEST',
                'New Team Join Request',
                `${userName} (${userEmail}) has requested to join your team "${teamRegistration.teamInfo.teamName}"`,
                {
                    teamId: teamRegistration.teamId,
                    hackathonId: teamRegistration.hackathonId,
                    userId: req.user.id
                }
            );
            console.log('Successfully created notification:', notification);
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    } else {
        console.error('No team leader found for team:', teamId);
    }

    res.status(200).json({
        success: true,
        message: 'Join request sent successfully',
        data: {
            teamName: teamRegistration.teamInfo.teamName,
            requestStatus: 'pending'
        }
    });
});

// Handle join request (accept/reject)
exports.handleJoinRequest = asyncHandler(async (req, res) => {
    const { teamId, userId } = req.params;
    const { status, message } = req.body; // status should be 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be either accepted or rejected'
        });
    }

    // Find the team's registration
    const teamRegistration = await Registration.findOne({ teamId })
        .populate('teamInfo.teammates.userId', 'firstName lastName email')
        .populate('teamInfo.joinRequests.userId', 'firstName lastName email');

    if (!teamRegistration) {
        return res.status(404).json({
            success: false,
            message: 'Team not found'
        });
    }

    // Check if user is team leader
    const isLeader = teamRegistration.teamInfo.teammates.some(
        member => member.userId._id.toString() === req.user.id && member.role === 'leader'
    );

    if (!isLeader) {
        return res.status(403).json({
            success: false,
            message: 'Only team leader can handle join requests'
        });
    }

    // Find the join request
    const joinRequest = teamRegistration.teamInfo.joinRequests.find(
        request => request.userId._id.toString() === userId && request.status === 'pending'
    );

    if (!joinRequest) {
        return res.status(404).json({
            success: false,
            message: 'No pending join request found for this user'
        });
    }

    // Update request status
    joinRequest.status = status;
    joinRequest.responseAt = new Date();
    if (message) joinRequest.message = message;

    if (status === 'accepted') {
        // Check if team is full
        if (teamRegistration.teamInfo.currentTeamSize >= teamRegistration.teamInfo.teamSize) {
            return res.status(400).json({
                success: false,
                message: 'Team is already full'
            });
        }

        // Add user to team
        teamRegistration.teamInfo.teammates.push({
            userId: joinRequest.userId._id,
            role: 'member',
            joinedAt: new Date()
        });

        // Update user's registration
        await Registration.findOneAndUpdate(
            {
                hackathonId: teamRegistration.hackathonId,
                userId: joinRequest.userId._id
            },
            {
                $set: {
                    'teamInfo.teamName': teamRegistration.teamInfo.teamName,
                    'teamInfo.teamSize': teamRegistration.teamInfo.teamSize,
                    'teamInfo.currentTeamSize': teamRegistration.teamInfo.currentTeamSize + 1,
                    'teamInfo.isTeamLeader': false,
                    'teamInfo.lookingForTeam': false,
                    'teamInfo.teammates': [{
                        userId: joinRequest.userId._id,
                        role: 'member',
                        joinedAt: new Date()
                    }]
                }
            },
            { upsert: true }
        );

        // Create notification for the user
        await createNotification(
            userId,
            'TEAM_REQUEST_ACCEPTED',
            'Team Join Request Accepted',
            `Your request to join team "${teamRegistration.teamInfo.teamName}" has been accepted`,
            {
                teamId: teamRegistration.teamId,
                hackathonId: teamRegistration.hackathonId
            }
        );
    } else if (status === 'rejected') {
        // Create notification for the user
        await createNotification(
            userId,
            'TEAM_REQUEST_REJECTED',
            'Team Join Request Rejected',
            `Your request to join team "${teamRegistration.teamInfo.teamName}" has been rejected`,
            {
                teamId: teamRegistration.teamId,
                hackathonId: teamRegistration.hackathonId
            }
        );
    }

    await teamRegistration.save();

    res.status(200).json({
        success: true,
        message: `Join request ${status}`,
        data: teamRegistration
    });
});

// Get all teams
exports.getAllTeams = asyncHandler(async (req, res) => {
    try {
        const teams = await Registration.find({
            'teamInfo.teamName': { $exists: true }
        })
            .populate('userId', 'firstName lastName email')
            .populate('hackathonId', 'title description');

        const formattedTeams = teams.map(team => ({
            teamId: team.teamId,
            teamName: team.teamInfo.teamName,
            teamSize: team.teamInfo.teamSize,
            currentTeamSize: team.teamInfo.currentTeamSize,
            lookingForTeam: team.teamInfo.lookingForTeam,
            teammates: team.teamInfo.teammates,
            hackathon: team.hackathonId,
            projectInfo: team.projectInfo,
            professionalInfo: team.professionalInfo,
            personalInfo: team.personalInfo,
            joinRequests: team.teamInfo.joinRequests
        }));

        res.status(200).json({
            success: true,
            data: formattedTeams
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching teams',
            error: error.message
        });
    }
});

// Get all teams for a specific user
exports.getUserTeams = asyncHandler(async (req, res) => {
    try {
        // Find all registrations where the user is either the registrant or a team member
        const userTeams = await Registration.find({
            $or: [
                { userId: req.params.userId },  // User is the main registrant
                { 'teamInfo.teammates.userId': req.params.userId }  // User is in teammates array
            ]
        })
            .populate('hackathonId', 'title description startDate endDate')
            .populate('teamInfo.teammates.userId', 'firstName lastName email avatar')
            .populate('projectInfo')
            .select('-personalInfo.phone');  // Exclude sensitive information

        // Transform the data to a more frontend-friendly format
        const formattedTeams = userTeams.map(registration => ({
            teamId: registration.teamId,
            hackathon: {
                id: registration.hackathonId?._id,
                name: registration.hackathonId?.title,
                description: registration.hackathonId?.description,
                startDate: registration.hackathonId?.startDate,
                endDate: registration.hackathonId?.endDate
            },
            team: {
                name: registration.teamInfo?.teamName,
                currentSize: registration.teamInfo?.currentTeamSize,
                maxSize: registration.teamInfo?.teamSize,
                isLeader: registration.teamInfo?.isTeamLeader,
                members: registration.teamInfo?.teammates.map(member => ({
                    id: member.userId?._id,
                    name: `${member.userId?.firstName} ${member.userId?.lastName}`,
                    email: member.userId?.email,
                    role: member.role,
                    avatar: member.userId?.avatar,
                    joinedAt: member.joinedAt
                }))
            },
            project: {
                title: registration.projectInfo?.projectTitle,
                description: registration.projectInfo?.projectDescription,
                techStack: registration.projectInfo?.techStack,
                category: registration.projectInfo?.category
            },
            status: registration.status
        }));

        res.status(200).json({
            success: true,
            count: formattedTeams.length,
            data: formattedTeams
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user teams',
            error: error.message
        });
    }
});

// Check team role for a specific hackathon
exports.checkTeamRole = asyncHandler(async (req, res) => {
    const { hackathonId } = req.params;
    const userId = req.user.id;  // From auth middleware

    try {
        console.log('Checking team role for:', { hackathonId, userId });

        // First try to find registration where user is a team member
        let registration = await Registration.findOne({
            hackathonId,
            'teamInfo.teammates.userId': userId  // Look for user in teammates array
        }).populate({
            path: 'teamInfo.teammates.userId',
            select: 'firstName lastName email avatar'
        });

        // If not found, try to find direct registration
        if (!registration) {
            registration = await Registration.findOne({
                hackathonId,
                userId
            }).populate({
                path: 'teamInfo.teammates.userId',
                select: 'firstName lastName email avatar'
            });
        }

        console.log('Found registration:', JSON.stringify(registration, null, 2));

        // If not registered at all
        if (!registration) {
            return res.status(200).json({
                success: true,
                data: {
                    status: 'NOT_REGISTERED',
                    message: 'Not registered for this hackathon',
                    isRegistered: false,
                    isTeamLeader: false,
                    isTeamMember: false
                }
            });
        }

        // If registered but no team info or no teammates
        if (!registration.teamInfo || !registration.teamInfo.teammates || registration.teamInfo.teammates.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    status: 'REGISTERED_NO_TEAM',
                    message: 'Registered but not in a team',
                    isRegistered: true,
                    isTeamLeader: false,
                    isTeamMember: false
                }
            });
        }

        // Find the user's role in the team
        const userTeammate = registration.teamInfo.teammates.find(member =>
            member.userId.toString() === userId ||
            member.userId._id?.toString() === userId
        );

        if (!userTeammate) {
            return res.status(200).json({
                success: true,
                data: {
                    status: 'REGISTERED_NO_TEAM',
                    message: 'Registered but not in a team',
                    isRegistered: true,
                    isTeamLeader: false,
                    isTeamMember: false
                }
            });
        }

        // Determine user's role
        const isTeamLeader = userTeammate.role === 'leader';
        const isTeamMember = userTeammate.role === 'member';

        // Prepare team data
        const teamData = {
            teamId: registration.teamId,
            teamName: registration.teamInfo.teamName,
            currentSize: registration.teamInfo.currentTeamSize || registration.teamInfo.teammates.length,
            maxSize: registration.teamInfo.teamSize,
            teammates: registration.teamInfo.teammates.map(member => ({
                id: member.userId._id || member.userId,
                name: member.userId.firstName && member.userId.lastName ?
                    `${member.userId.firstName} ${member.userId.lastName}` : 'Unknown',
                email: member.userId.email || '',
                avatar: member.userId.avatar || '',
                role: member.role,
                joinedAt: member.joinedAt
            })),
            lookingForTeam: registration.teamInfo.lookingForTeam,
            joinRequests: registration.teamInfo.joinRequests || []
        };

        // Determine status and message
        const status = isTeamLeader ? 'TEAM_LEADER' : 'TEAM_MEMBER';
        const message = isTeamLeader ? 'You are the team leader' : 'You are a team member';

        console.log('Sending response:', {
            userId,
            status,
            isTeamLeader,
            isTeamMember,
            teamName: teamData.teamName
        });

        return res.status(200).json({
            success: true,
            data: {
                status,
                message,
                isRegistered: true,
                isTeamLeader,
                isTeamMember,
                team: teamData
            }
        });

    } catch (error) {
        console.error('Error checking team role:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error while checking team role',
            details: error.message
        });
    }
});

// Invite team member
exports.inviteTeamMember = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { invitedUserId } = req.body;

    // Find team registration
    const teamRegistration = await Registration.findOne({ teamId })
        .populate('teamInfo.teammates.userId', 'firstName lastName email');

    if (!teamRegistration) {
        return res.status(404).json({
            success: false,
            message: 'Team not found'
        });
    }

    // Check if user is team leader
    const isLeader = teamRegistration.teamInfo.teammates.some(
        member => member.userId._id.toString() === req.user.id && member.role === 'leader'
    );

    if (!isLeader) {
        return res.status(403).json({
            success: false,
            message: 'Only team leader can invite members'
        });
    }

    // Check if team is full
    if (teamRegistration.teamInfo.currentTeamSize >= teamRegistration.teamInfo.teamSize) {
        return res.status(400).json({
            success: false,
            message: 'Team is already full'
        });
    }

    // Check if user is already in the team
    const alreadyInTeam = teamRegistration.teamInfo.teammates.some(
        member => member.userId._id.toString() === invitedUserId
    );

    if (alreadyInTeam) {
        return res.status(400).json({
            success: false,
            message: 'User is already in the team'
        });
    }

    // Check if user already has a pending invitation
    const pendingInvitation = teamRegistration.teamInfo.joinRequests.find(
        request => request.userId.toString() === invitedUserId && request.status === 'pending'
    );

    if (pendingInvitation) {
        return res.status(400).json({
            success: false,
            message: 'User already has a pending invitation'
        });
    }

    // Add invitation
    teamRegistration.teamInfo.joinRequests.push({
        userId: invitedUserId,
        status: 'pending',
        requestedAt: new Date(),
        type: 'invitation'
    });

    await teamRegistration.save();

    // Create notification for invited user
    await createNotification(
        invitedUserId,
        'TEAM_INVITATION',
        'Team Invitation',
        `You have been invited to join team "${teamRegistration.teamInfo.teamName}"`,
        {
            teamId: teamRegistration.teamId,
            hackathonId: teamRegistration.hackathonId
        }
    );

    res.status(200).json({
        success: true,
        message: 'Invitation sent successfully',
        data: teamRegistration
    });
});

// Accept team invitation
exports.acceptTeamInvitation = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const userId = req.user.id;

    // Find team registration
    const teamRegistration = await Registration.findOne({ teamId })
        .populate('teamInfo.teammates.userId', 'firstName lastName email');

    if (!teamRegistration) {
        return res.status(404).json({
            success: false,
            message: 'Team not found'
        });
    }

    // Find invitation
    const invitation = teamRegistration.teamInfo.joinRequests.find(
        request => request.userId.toString() === userId &&
            request.status === 'pending' &&
            request.type === 'invitation'
    );

    if (!invitation) {
        return res.status(404).json({
            success: false,
            message: 'No pending invitation found'
        });
    }

    // Check if team is still not full
    if (teamRegistration.teamInfo.currentTeamSize >= teamRegistration.teamInfo.teamSize) {
        invitation.status = 'rejected';
        await teamRegistration.save();
        return res.status(400).json({
            success: false,
            message: 'Team is already full'
        });
    }

    // Update invitation status
    invitation.status = 'accepted';
    invitation.responseAt = new Date();

    // Add user to team
    teamRegistration.teamInfo.teammates.push({
        userId,
        role: 'member',
        joinedAt: new Date()
    });

    teamRegistration.teamInfo.currentTeamSize = teamRegistration.teamInfo.teammates.length;

    // Create or update user's registration
    const userRegistration = await Registration.findOneAndUpdate(
        {
            hackathonId: teamRegistration.hackathonId,
            userId
        },
        {
            $set: {
                teamId: teamRegistration.teamId,
                'teamInfo.teamName': teamRegistration.teamInfo.teamName,
                'teamInfo.teamSize': teamRegistration.teamInfo.teamSize,
                'teamInfo.currentTeamSize': teamRegistration.teamInfo.currentTeamSize,
                'teamInfo.isTeamLeader': false,
                'teamInfo.lookingForTeam': false,
                'teamInfo.teammates': teamRegistration.teamInfo.teammates
            }
        },
        { upsert: true, new: true }
    );

    await teamRegistration.save();

    // Notify team leader
    const teamLeader = teamRegistration.teamInfo.teammates.find(member => member.role === 'leader');
    if (teamLeader) {
        await createNotification(
            teamLeader.userId._id,
            'TEAM_INVITATION_ACCEPTED',
            'Invitation Accepted',
            `A user has accepted your team invitation`,
            {
                teamId: teamRegistration.teamId,
                hackathonId: teamRegistration.hackathonId,
                userId
            }
        );
    }

    res.status(200).json({
        success: true,
        message: 'Successfully joined the team',
        data: {
            teamRegistration,
            userRegistration
        }
    });
});

// Reject team invitation
exports.rejectTeamInvitation = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const userId = req.user.id;

    // Find team registration
    const teamRegistration = await Registration.findOne({ teamId });

    if (!teamRegistration) {
        return res.status(404).json({
            success: false,
            message: 'Team not found'
        });
    }

    // Find invitation
    const invitation = teamRegistration.teamInfo.joinRequests.find(
        request => request.userId.toString() === userId &&
            request.status === 'pending' &&
            request.type === 'invitation'
    );

    if (!invitation) {
        return res.status(404).json({
            success: false,
            message: 'No pending invitation found'
        });
    }

    // Update invitation status
    invitation.status = 'rejected';
    invitation.responseAt = new Date();

    await teamRegistration.save();

    // Notify team leader
    const teamLeader = teamRegistration.teamInfo.teammates.find(member => member.role === 'leader');
    if (teamLeader) {
        await createNotification(
            teamLeader.userId._id,
            'TEAM_INVITATION_REJECTED',
            'Invitation Rejected',
            `A user has rejected your team invitation`,
            {
                teamId: teamRegistration.teamId,
                hackathonId: teamRegistration.hackathonId,
                userId
            }
        );
    }

    res.status(200).json({
        success: true,
        message: 'Invitation rejected successfully'
    });
});

// Get available users for team formation
exports.getAvailableUsers = asyncHandler(async (req, res) => {
    const { hackathonId } = req.params;

    try {
        // First, verify the hackathon exists
        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        // Get all users who are in teams for this hackathon
        const usersInTeams = await Registration.find({
            hackathonId: hackathonId,
            'teamInfo.teammates': { $exists: true, $not: { $size: 0 } }
        }).distinct('userId');

        // Find all candidate users who are not in any team
        const availableUsers = await User.find({
            _id: { $nin: usersInTeams },
            role: 'candidate'
        }).select('firstName lastName email avatar skills');

        // Get registration status for each user
        const usersWithStatus = await Promise.all(availableUsers.map(async user => {
            const registration = await Registration.findOne({
                hackathonId: hackathonId,
                userId: user._id
            });

            return {
                id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                avatar: user.avatar,
                skills: user.skills || [],
                registrationStatus: registration ? 'registered' : 'not_registered',
                lookingForTeam: registration?.teamInfo?.lookingForTeam || false,
                professionalInfo: registration?.professionalInfo || null
            };
        }));

        // Sort users: first registered users looking for team, then others
        const sortedUsers = usersWithStatus.sort((a, b) => {
            if (a.registrationStatus === 'registered' && a.lookingForTeam) return -1;
            if (b.registrationStatus === 'registered' && b.lookingForTeam) return 1;
            if (a.registrationStatus === 'registered') return -1;
            if (b.registrationStatus === 'registered') return 1;
            return 0;
        });

        res.status(200).json({
            success: true,
            count: sortedUsers.length,
            data: sortedUsers
        });

    } catch (error) {
        console.error('Error in getAvailableUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching available users',
            error: error.message
        });
    }
});

// Send join request to a team
exports.sendJoinRequest = asyncHandler(async (req, res) => {
    const { hackathonId, teamId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    try {
        // Find the team's registration
        const teamRegistration = await Registration.findOne({
            hackathonId,
            teamId
        }).populate('teamInfo.teammates.userId', 'firstName lastName email');

        if (!teamRegistration) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Check if team is full
        if (teamRegistration.teamInfo.currentTeamSize >= teamRegistration.teamInfo.teamSize) {
            return res.status(400).json({
                success: false,
                message: 'Team is already full'
            });
        }

        // Check if user already has a pending request for this team
        const existingRequest = teamRegistration.teamInfo.joinRequests.find(
            request => request.userId.toString() === userId && request.status === 'pending'
        );

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending request for this team'
            });
        }

        // Check if user is already in a team for this hackathon
        const userInTeam = await Registration.findOne({
            hackathonId,
            'teamInfo.teammates.userId': userId
        });

        if (userInTeam) {
            return res.status(400).json({
                success: false,
                message: 'You are already in a team for this hackathon'
            });
        }

        // Add join request
        teamRegistration.teamInfo.joinRequests.push({
            userId,
            status: 'pending',
            message: message || 'I would like to join your team',
            requestedAt: new Date(),
            type: 'request'
        });

        await teamRegistration.save();

        // Notify team leader
        const teamLeader = teamRegistration.teamInfo.teammates.find(member => member.role === 'leader');
        if (teamLeader) {
            await createNotification(
                teamLeader.userId._id,
                'TEAM_JOIN_REQUEST',
                'New Join Request',
                `A user has requested to join your team "${teamRegistration.teamInfo.teamName}"`,
                {
                    teamId,
                    hackathonId,
                    userId
                }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Join request sent successfully',
            data: {
                teamName: teamRegistration.teamInfo.teamName,
                requestStatus: 'pending'
            }
        });

    } catch (error) {
        console.error('Error in sendJoinRequest:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending join request',
            error: error.message
        });
    }
});

// Get join requests for a hackathon
exports.getJoinRequests = asyncHandler(async (req, res) => {
    const { hackathonId } = req.params;
    const userId = req.user.id;

    try {
        // Find all teams where the user is a leader
        const userTeams = await Registration.find({
            hackathonId,
            'teamInfo.teammates': {
                $elemMatch: {
                    userId,
                    role: 'leader'
                }
            }
        }).populate({
            path: 'teamInfo.joinRequests.userId',
            select: 'firstName lastName email avatar skills professionalInfo'
        });

        // Collect all pending join requests
        const pendingRequests = userTeams.flatMap(team =>
            team.teamInfo.joinRequests
                .filter(request => request.status === 'pending' && request.type === 'request')
                .map(request => ({
                    requestId: request._id,
                    teamId: team.teamId,
                    teamName: team.teamInfo.teamName,
                    user: {
                        id: request.userId._id,
                        name: `${request.userId.firstName} ${request.userId.lastName}`,
                        email: request.userId.email,
                        avatar: request.userId.avatar,
                        skills: request.userId.skills || [],
                        professionalInfo: request.userId.professionalInfo
                    },
                    message: request.message,
                    requestedAt: request.requestedAt,
                    currentTeamSize: team.teamInfo.currentTeamSize,
                    maxTeamSize: team.teamInfo.teamSize
                }))
        );

        res.status(200).json({
            success: true,
            count: pendingRequests.length,
            data: pendingRequests
        });

    } catch (error) {
        console.error('Error in getJoinRequests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching join requests',
            error: error.message
        });
    }
});

// Respond to join request (accept/reject)
exports.respondToJoinRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { status, message } = req.body; // status should be 'accepted' or 'rejected'
    const userId = req.user.id;

    try {
        // Find the team registration containing this request
        const teamRegistration = await Registration.findOne({
            'teamInfo.joinRequests._id': requestId
        }).populate('teamInfo.teammates.userId', 'firstName lastName email');

        if (!teamRegistration) {
            return res.status(404).json({
                success: false,
                message: 'Join request not found'
            });
        }

        // Verify user is team leader
        const isLeader = teamRegistration.teamInfo.teammates.some(
            member => member.userId._id.toString() === userId && member.role === 'leader'
        );

        if (!isLeader) {
            return res.status(403).json({
                success: false,
                message: 'Only team leader can respond to join requests'
            });
        }

        // Find the join request
        const joinRequest = teamRegistration.teamInfo.joinRequests.id(requestId);
        if (!joinRequest || joinRequest.status !== 'pending') {
            return res.status(404).json({
                success: false,
                message: 'No pending join request found'
            });
        }

        // Update request status
        joinRequest.status = status;
        joinRequest.responseAt = new Date();
        joinRequest.responseMessage = message;

        if (status === 'accepted') {
            // Check if team is still not full
            if (teamRegistration.teamInfo.currentTeamSize >= teamRegistration.teamInfo.teamSize) {
                return res.status(400).json({
                    success: false,
                    message: 'Team is already full'
                });
            }

            // Add user to team
            teamRegistration.teamInfo.teammates.push({
                userId: joinRequest.userId,
                role: 'member',
                joinedAt: new Date()
            });

            teamRegistration.teamInfo.currentTeamSize = teamRegistration.teamInfo.teammates.length;

            // Update user's registration
            await Registration.findOneAndUpdate(
                {
                    hackathonId: teamRegistration.hackathonId,
                    userId: joinRequest.userId
                },
                {
                    $set: {
                        teamId: teamRegistration.teamId,
                        'teamInfo.teamName': teamRegistration.teamInfo.teamName,
                        'teamInfo.teamSize': teamRegistration.teamInfo.teamSize,
                        'teamInfo.currentTeamSize': teamRegistration.teamInfo.currentTeamSize,
                        'teamInfo.isTeamLeader': false,
                        'teamInfo.lookingForTeam': false
                    }
                },
                { upsert: true }
            );

            // Notify user that request was accepted
            await createNotification(
                joinRequest.userId,
                'JOIN_REQUEST_ACCEPTED',
                'Join Request Accepted',
                `Your request to join team "${teamRegistration.teamInfo.teamName}" has been accepted`,
                {
                    teamId: teamRegistration.teamId,
                    hackathonId: teamRegistration.hackathonId
                }
            );
        } else {
            // Notify user that request was rejected
            await createNotification(
                joinRequest.userId,
                'JOIN_REQUEST_REJECTED',
                'Join Request Rejected',
                `Your request to join team "${teamRegistration.teamInfo.teamName}" has been rejected`,
                {
                    teamId: teamRegistration.teamId,
                    hackathonId: teamRegistration.hackathonId
                }
            );
        }

        await teamRegistration.save();

        res.status(200).json({
            success: true,
            message: `Join request ${status}`,
            data: teamRegistration
        });

    } catch (error) {
        console.error('Error in respondToJoinRequest:', error);
        res.status(500).json({
            success: false,
            message: 'Error responding to join request',
            error: error.message
        });
    }
});