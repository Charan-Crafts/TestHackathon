const RoundResponse = require('../models/RoundResponse');
const File = require('../models/File');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create or update a round response
// @route   POST /api/round-responses
// @access  Private
exports.createOrUpdateResponse = async (req, res) => {
    try {
        const { hackathonId, roundId, responses, teamId } = req.body;

        // Check if response already exists
        let roundResponse = await RoundResponse.findOne({
            hackathonId,
            roundId,
            userId: req.user.id
        });

        if (roundResponse) {
            // Update existing response
            roundResponse.responses = responses;
            roundResponse.teamId = teamId;
            roundResponse.status = 'draft';
            await roundResponse.save();
        } else {
            // Create new response
            roundResponse = new RoundResponse({
                hackathonId,
                roundId,
                userId: req.user.id,
                teamId,
                responses,
                status: 'draft'
            });
            await roundResponse.save();
        }

        res.json(roundResponse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Submit a round response
// @route   PUT /api/round-responses/:id/submit
// @access  Private
exports.submitResponse = async (req, res) => {
    try {
        const roundResponse = await RoundResponse.findById(req.params.id);

        if (!roundResponse) {
            return res.status(404).json({ msg: 'Response not found' });
        }

        // Check if user owns the response
        if (roundResponse.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        roundResponse.status = 'submitted';
        roundResponse.submittedAt = Date.now();
        await roundResponse.save();

        res.json(roundResponse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user's response for a specific round
// @route   GET /api/round-responses/hackathon/:hackathonId/round/:roundId
// @access  Private
exports.getUserResponse = async (req, res) => {
    try {
        const roundResponse = await RoundResponse.findOne({
            hackathonId: req.params.hackathonId,
            roundId: req.params.roundId,
            userId: req.user.id
        });

        if (!roundResponse) {
            return res.status(404).json({ msg: 'Response not found' });
        }

        res.json(roundResponse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all responses for a round (organizer only)
// @route   GET /api/round-responses/hackathon/:hackathonId/round/:roundId/all
// @access  Private
exports.getAllResponses = async (req, res) => {
    try {
        // TODO: Add organizer check middleware
        const responses = await RoundResponse.find({
            hackathonId: req.params.hackathonId,
            roundId: req.params.roundId
        }).populate('userId', 'name email');

        res.json(responses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Review a round response (organizer only)
// @route   PUT /api/round-responses/:id/review
// @access  Private (organizer)
exports.reviewResponse = async (req, res) => {
    try {
        console.log('Review request received:', {
            id: req.params.id,
            user: req.user.id,
            body: req.body
        });

        const roundResponse = await RoundResponse.findById(req.params.id);

        if (!roundResponse) {
            console.log('Response not found:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Response not found'
            });
        }

        const {
            score,
            qualification,
            awardType,
            awardTitle,
            reviewComments,
            status
        } = req.body;

        // Update all review fields
        roundResponse.score = score;
        roundResponse.qualification = qualification;
        roundResponse.awardType = awardType;
        roundResponse.awardTitle = awardTitle;
        roundResponse.reviewComments = reviewComments;
        roundResponse.status = status;
        roundResponse.reviewedBy = req.user.id;
        roundResponse.reviewedAt = new Date();

        // Save the updated response
        await roundResponse.save();

        console.log('Review saved successfully:', {
            id: roundResponse._id,
            status: roundResponse.status
        });

        res.json({
            success: true,
            data: roundResponse
        });
    } catch (err) {
        console.error('Review submission error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};

// @desc    Check if user is qualified for next round
// @route   GET /api/round-responses/hackathon/:hackathonId/round/:roundId/qualification
// @access  Private
exports.checkRoundQualification = async (req, res) => {
    try {
        const { hackathonId, roundId } = req.params;
        const userId = req.user.id;

        // Find the user's response for the current round
        const roundResponse = await RoundResponse.findOne({
            hackathonId,
            roundId,
            userId
        });

        if (!roundResponse) {
            return res.status(404).json({
                success: false,
                message: 'No response found for this round'
            });
        }

        // Check if the response has been reviewed and qualified
        const isQualified = roundResponse.status === 'evaluated' &&
            roundResponse.qualification === 'qualified';

        res.json({
            success: true,
            data: {
                isQualified,
                status: roundResponse.status,
                qualification: roundResponse.qualification,
                score: roundResponse.score,
                reviewComments: roundResponse.reviewComments
            }
        });
    } catch (err) {
        console.error('Error checking round qualification:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};

// @desc    Upload file for a round response
// @route   POST /api/round-responses/:id/upload-file
// @access  Private
exports.uploadResponseFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorResponse('Please upload a file', 400));
        }

        const roundResponse = await RoundResponse.findById(req.params.id);
        if (!roundResponse) {
            return next(new ErrorResponse('Round response not found', 404));
        }

        // Check if user owns the response
        if (roundResponse.userId.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to upload files for this response', 403));
        }

        // Create file record
        const file = await File.create({
            fileName: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            uploadedBy: req.user.id,
            entityType: 'submission',
            entityId: roundResponse._id,
            isPublic: false
        });

        // Add file reference to the response
        const fieldId = req.body.fieldId;
        const responseIndex = roundResponse.responses.findIndex(r => r.fieldId === fieldId);

        if (responseIndex === -1) {
            return next(new ErrorResponse('Invalid field ID', 400));
        }

        if (!roundResponse.responses[responseIndex].files) {
            roundResponse.responses[responseIndex].files = [];
        }
        roundResponse.responses[responseIndex].files.push(file._id);
        await roundResponse.save();

        res.status(201).json({
            success: true,
            data: {
                fileId: file._id,
                fileUrl: file.fileUrl
            }
        });
    } catch (err) {
        next(err);
    }
}; 