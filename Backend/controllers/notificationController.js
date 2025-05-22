const Notification = require('../models/Notification');
const Registration = require('../models/Registration');
const asyncHandler = require('express-async-handler');

// Get all notifications for the current user
exports.getMyNotifications = asyncHandler(async (req, res) => {
    console.log('\n=== Fetching Notifications ===');
    console.log('User ID:', req.user.id);

    const notifications = await Notification.find({ recipient: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50);

    console.log('Found notifications:', notifications.length);
    console.log('=== Fetch Complete ===\n');

    res.status(200).json({
        success: true,
        data: notifications
    });
});

// Mark a notification as read
exports.markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user.id },
        { read: true },
        { new: true }
    );

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: 'Notification not found'
        });
    }

    res.status(200).json({
        success: true,
        data: notification
    });
});

// Mark all notifications as read
exports.markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user.id, read: false },
        { read: true }
    );

    res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
    });
});

// Handle team join request response (accept/reject)
exports.handleTeamResponse = asyncHandler(async (req, res) => {
    console.log('\n=== Processing Team Response ===');
    const { id } = req.params;
    const { response } = req.body;

    console.log('Notification ID:', id);
    console.log('Response:', response);

    // Validate response
    if (!['accepted', 'rejected'].includes(response)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid response. Must be either accepted or rejected'
        });
    }

    // Find the notification
    const notification = await Notification.findOne({
        _id: id,
        recipient: req.user.id,
        type: 'TEAM_JOIN_REQUEST'
    });

    if (!notification) {
        console.log('Notification not found');
        return res.status(404).json({
            success: false,
            message: 'Notification not found'
        });
    }

    if (notification.status !== 'pending') {
        console.log('Request already processed');
        return res.status(400).json({
            success: false,
            message: 'This request has already been processed'
        });
    }

    console.log('Found notification:', notification);

    // Update notification status
    notification.status = response;
    notification.read = true;

    if (response === 'accepted') {
        console.log('Processing acceptance...');
        // Get registration and add user to team
        const registration = await Registration.findOne({ teamId: notification.metadata.teamId });
        
        if (!registration) {
            console.log('Team registration not found');
            return res.status(404).json({
                success: false,
                message: 'Team registration not found'
            });
        }

        // Check if team is full
        if (registration.teamInfo.currentTeamSize >= registration.teamInfo.teamSize) {
            console.log('Team is full');
            return res.status(400).json({
                success: false,
                message: 'Team is already full'
            });
        }

        // Check if user is already in team
        const isAlreadyMember = registration.teamInfo.teammates.some(
            teammate => teammate.userId.toString() === notification.metadata.userId
        );

        if (!isAlreadyMember) {
            console.log('Adding user to team');
            // Add user to teammates
            registration.teamInfo.teammates.push({
                userId: notification.metadata.userId,
                role: 'member',
                joinedAt: new Date()
            });

            // Update team size
            registration.teamInfo.currentTeamSize = registration.teamInfo.teammates.length;

            // Update join request status
            const joinRequest = registration.teamInfo.joinRequests.find(
                request => request.userId.toString() === notification.metadata.userId
            );
            if (joinRequest) {
                joinRequest.status = 'accepted';
                joinRequest.responseAt = new Date();
            }

            await registration.save();
            console.log('Team updated successfully');

            // Create notification for the requesting user
            await exports.createNotification(
                notification.metadata.userId,
                'TEAM_REQUEST_ACCEPTED',
                'Team Join Request Accepted',
                `Your request to join team "${registration.teamInfo.teamName}" has been accepted`,
                {
                    teamId: registration.teamId,
                    hackathonId: registration.hackathonId
                }
            );
        }
    } else {
        console.log('Processing rejection...');
        // Create notification for the requesting user
        await exports.createNotification(
            notification.metadata.userId,
            'TEAM_REQUEST_REJECTED',
            'Team Join Request Rejected',
            `Your request to join team has been rejected`,
            {
                teamId: notification.metadata.teamId,
                hackathonId: notification.metadata.hackathonId
            }
        );
    }

    await notification.save();
    console.log('=== Team Response Processing Complete ===\n');

    res.status(200).json({
        success: true,
        data: notification
    });
});

// Create a notification (internal use only)
exports.createNotification = async (recipientId, type, title, message, metadata = {}) => {
    try {
        console.log('\n=== Notification Creation Start ===');
        console.log('Sender ID:', metadata.userId);
        console.log('Recipient ID:', recipientId);

        // Check if recipient is connected
        const recipientSocketId = Array.from(global.io.sockets.sockets.keys()).find(socketId => {
            const socket = global.io.sockets.sockets.get(socketId);
            return socket.userId === recipientId.toString();
        });

        console.log('Recipient socket found:', recipientSocketId ? 'Yes' : 'No');
        if (recipientSocketId) {
            console.log('Recipient socket ID:', recipientSocketId);
        }

        // Log all connected users
        console.log('\nCurrently connected users:');
        global.io.sockets.sockets.forEach((socket, id) => {
            console.log(`Socket ID: ${id}, User ID: ${socket.userId}`);
        });

        // Create notification
        console.log('\nCreating notification in database...');
        const notification = await Notification.create({
            recipient: recipientId,
            type,
            title,
            message,
            metadata
        });
        console.log('Notification created:', notification._id);

        // Emit to specific room
        console.log('\nEmitting notification...');
        console.log('Target room:', recipientId.toString());
        console.log('Available rooms:', Array.from(global.io.sockets.adapter.rooms.keys()));

        global.io.to(recipientId.toString()).emit('notification', {
            ...notification.toObject(),
            _debugInfo: {
                sentAt: new Date().toISOString(),
                recipientSocketFound: !!recipientSocketId
            }
        });

        console.log('Notification emitted');
        console.log('=== Notification Creation End ===\n');

        return notification;
    } catch (error) {
        console.error('Error in createNotification:', error);
        throw error;
    }
};
