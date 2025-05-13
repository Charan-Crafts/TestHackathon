const Submission = require('../models/Submission');
const Hackathon = require('../models/Hackathon');
const { handleApiError } = require('../utils/errorHandler');

// @desc    Get all submissions for an organizer's hackathons
// @route   GET /api/submissions/organizer
// @access  Private (Organizer only)
exports.getOrganizerSubmissions = async (req, res) => {
    try {
        // Get all hackathons created by the organizer
        const hackathons = await Hackathon.find({ organizer: req.user._id });
        const hackathonIds = hackathons.map(h => h._id);

        // Get all submissions for these hackathons
        const submissions = await Submission.find({ hackathonId: { $in: hackathonIds } })
            .populate('teamId', 'name members')
            .populate('hackathonId', 'title image')
            .populate('submittedBy', 'name email')
            .populate('roundId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: submissions
        });
    } catch (error) {
        handleApiError(res, error);
    }
};

// @desc    Get submissions for a specific hackathon
// @route   GET /api/submissions/hackathon/:hackathonId
// @access  Private (Organizer only)
exports.getHackathonSubmissions = async (req, res) => {
    try {
        const { hackathonId } = req.params;

        // Verify the hackathon belongs to the organizer
        const hackathon = await Hackathon.findOne({
            _id: hackathonId,
            organizer: req.user._id
        });

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found or you are not authorized'
            });
        }

        // Get all submissions for this hackathon
        const submissions = await Submission.find({ hackathonId })
            .populate('teamId', 'name members')
            .populate('hackathonId', 'title image')
            .populate('submittedBy', 'name email')
            .populate('roundId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: submissions
        });
    } catch (error) {
        handleApiError(res, error);
    }
};

// @desc    Get submission statistics for an organizer
// @route   GET /api/submissions/organizer/stats
// @access  Private (Organizer only)
exports.getOrganizerSubmissionStats = async (req, res) => {
    try {
        // Get all hackathons created by the organizer
        const hackathons = await Hackathon.find({ organizer: req.user._id });
        const hackathonIds = hackathons.map(h => h._id);

        // Get submission statistics
        const stats = await Submission.aggregate([
            {
                $match: {
                    hackathonId: { $in: hackathonIds }
                }
            },
            {
                $group: {
                    _id: '$hackathonId',
                    totalSubmissions: { $sum: 1 },
                    pendingSubmissions: {
                        $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] }
                    },
                    reviewedSubmissions: {
                        $sum: { $cond: [{ $eq: ['$status', 'under-review'] }, 1, 0] }
                    },
                    evaluatedSubmissions: {
                        $sum: { $cond: [{ $eq: ['$status', 'evaluated'] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'hackathons',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'hackathon'
                }
            },
            {
                $unwind: '$hackathon'
            },
            {
                $project: {
                    _id: 1,
                    totalSubmissions: 1,
                    pendingSubmissions: 1,
                    reviewedSubmissions: 1,
                    evaluatedSubmissions: 1,
                    hackathonTitle: '$hackathon.title',
                    hackathonImage: '$hackathon.image'
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        handleApiError(res, error);
    }
};

// @desc    Get a submission by ID
// @route   GET /api/submissions/:submissionId
// @access  Private (Organizer only)
exports.getSubmissionById = async (req, res) => {
    try {
        const { submissionId } = req.params;

        // Find the submission and verify it belongs to one of the organizer's hackathons
        const submission = await Submission.findOne({ _id: submissionId })
            .populate('teamId', 'name members')
            .populate('hackathonId', 'title image')
            .populate('submittedBy', 'name email')
            .populate('roundId', 'name');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Verify the hackathon belongs to the organizer
        const hackathon = await Hackathon.findOne({
            _id: submission.hackathonId,
            organizer: req.user._id
        });

        if (!hackathon) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this submission'
            });
        }

        res.status(200).json({
            success: true,
            data: submission
        });
    } catch (error) {
        handleApiError(res, error);
    }
};

// @desc    Get test link UUID for a submission
// @route   GET /api/submissions/test-link/:submissionId
// @access  Private (Organizer only)
exports.getTestLinkUUID = async (req, res) => {
    try {
        const { submissionId } = req.params;

        // Find the submission and verify it belongs to one of the organizer's hackathons
        const submission = await Submission.findOne({ _id: submissionId })
            .populate('hackathonId', 'title');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Verify the hackathon belongs to the organizer
        const hackathon = await Hackathon.findOne({
            _id: submission.hackathonId,
            organizer: req.user._id
        });

        if (!hackathon) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this submission'
            });
        }

        // Find the platform link field in responses
        const platformLinkField = submission.responses?.find(
            field => field.fieldType === 'platform_link'
        );

        if (!platformLinkField || !platformLinkField.value) {
            return res.status(404).json({
                success: false,
                message: 'No test link found for this submission'
            });
        }

        // Extract UUID from the platform link
        const testId = platformLinkField.value.split('/').pop();

        res.status(200).json({
            success: true,
            data: {
                testId,
                platformLink: platformLinkField.value
            }
        });
    } catch (error) {
        handleApiError(res, error);
    }
}; 