const HackathonApplication = require('../models/HackathonApplication');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');

/**
 * @desc    Submit a new hackathon application
 * @route   POST /api/hackathon-applications
 * @access  Public (with optional authentication)
 */
exports.submitApplication = async (req, res) => {
    try {
        const {
            organizerName,
            organizerEmail,
            organizerWebsite,
            hackathonName,
            hackathonTheme,
            tentativeDates,
            purpose,
            expectedParticipants,
            locationPreference,
            targetAudience,
            additionalInformation
        } = req.body;

        // Check required fields
        if (!organizerName || !organizerEmail || !hackathonName || !hackathonTheme || !tentativeDates || !purpose) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create application object
        const applicationData = {
            organizerName,
            organizerEmail,
            organizerWebsite,
            hackathonName,
            hackathonTheme,
            tentativeDates,
            purpose,
            expectedParticipants,
            locationPreference,
            targetAudience,
            additionalInformation,
            status: 'pending'
        };

        // If user is authenticated, associate application with their account
        if (req.user) {
            applicationData.userId = req.user.id;
        }

        // Create the application
        const application = await HackathonApplication.create(applicationData);

        return res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Error submitting hackathon application:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to submit hackathon application',
            error: error.message
        });
    }
};

/**
 * @desc    Get all hackathon applications (Admin only)
 * @route   GET /api/hackathon-applications
 * @access  Private (Admin)
 */
exports.getApplications = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Filter options
        const filter = {};

        // Filter by status
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Filter by search term
        if (req.query.search) {
            filter.$or = [
                { organizerName: { $regex: req.query.search, $options: 'i' } },
                { organizerEmail: { $regex: req.query.search, $options: 'i' } },
                { hackathonName: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const applications = await HackathonApplication.find(filter)
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        // Get total documents
        const total = await HackathonApplication.countDocuments(filter);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            count: applications.length,
            pagination: {
                total,
                page,
                limit,
                totalPages
            },
            data: applications
        });
    } catch (error) {
        console.error('Error getting hackathon applications:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get hackathon applications',
            error: error.message
        });
    }
};

/**
 * @desc    Get a specific hackathon application
 * @route   GET /api/hackathon-applications/:id
 * @access  Private (Admin or application owner)
 */
exports.getApplication = async (req, res) => {
    try {
        const application = await HackathonApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon application not found'
            });
        }

        // Check if user is authorized to view the application
        if (req.user.role !== 'admin' &&
            (!application.userId || application.userId.toString() !== req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this application'
            });
        }

        return res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Error getting hackathon application:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get hackathon application',
            error: error.message
        });
    }
};

/**
 * @desc    Update a hackathon application
 * @route   PUT /api/hackathon-applications/:id
 * @access  Private (Application owner only, and only if pending)
 */
exports.updateApplication = async (req, res) => {
    try {
        let application = await HackathonApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon application not found'
            });
        }

        // Check if user owns this application
        if (!application.userId || application.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this application'
            });
        }

        // Check if application is still pending
        if (application.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot update application with status: ${application.status}`
            });
        }

        // Update application
        application = await HackathonApplication.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Error updating hackathon application:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to update hackathon application',
            error: error.message
        });
    }
};

/**
 * @desc    Delete a hackathon application
 * @route   DELETE /api/hackathon-applications/:id
 * @access  Private (Application owner or Admin)
 */
exports.deleteApplication = async (req, res) => {
    try {
        const application = await HackathonApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon application not found'
            });
        }

        // Check ownership or admin access
        const isOwner = application.userId && application.userId.toString() === req.user.id;
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this application'
            });
        }

        await application.remove();

        return res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting hackathon application:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete hackathon application',
            error: error.message
        });
    }
};

/**
 * @desc    Review hackathon application (approve/reject) - Admin only
 * @route   PUT /api/hackathon-applications/:id/review
 * @access  Private (Admin)
 */
exports.reviewApplication = async (req, res) => {
    try {
        const { status, notes, rejectionReason } = req.body;

        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid status (approved/rejected)'
            });
        }

        // If rejecting, require a reason
        if (status === 'rejected' && !rejectionReason) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a rejection reason'
            });
        }

        let application = await HackathonApplication.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon application not found'
            });
        }

        // Update application status
        application.status = status;
        application.reviewedBy = req.user.id;
        application.reviewedAt = Date.now();

        if (status === 'rejected') {
            application.rejectionReason = rejectionReason;
        } else {
            application.rejectionReason = undefined;
        }

        if (notes) {
            application.notes = notes;
        }

        await application.save();

        // If approved, prompt the organizer to create the full hackathon
        // In a real implementation, send an email with a link to create hackathon

        return res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Error reviewing hackathon application:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to review hackathon application',
            error: error.message
        });
    }
};

/**
 * @desc    Get my hackathon applications
 * @route   GET /api/hackathon-applications/my-applications
 * @access  Private
 */
exports.getMyApplications = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Get applications for this user
        const applications = await HackathonApplication.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        // Get total documents
        const total = await HackathonApplication.countDocuments({ userId: req.user.id });

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            count: applications.length,
            pagination: {
                total,
                page,
                limit,
                totalPages
            },
            data: applications
        });
    } catch (error) {
        console.error('Error getting my applications:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get applications',
            error: error.message
        });
    }
}; 