const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const roundResponseController = require('../controllers/roundResponseController');
const { uploadSingleFile } = require('../middleware/fileUpload');

// Validation middleware
const validateRoundResponse = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// @route   POST api/round-responses
// @desc    Create or update a round response
// @access  Private
router.post('/',
    protect,
    [
        check('hackathonId', 'Hackathon ID is required').not().isEmpty(),
        check('roundId', 'Round ID is required').not().isEmpty(),
        check('responses', 'Responses are required').isArray()
    ],
    validateRoundResponse,
    roundResponseController.createOrUpdateResponse
);

// @route   PUT api/round-responses/:id/submit
// @desc    Submit a round response
// @access  Private
router.put('/:id/submit', protect, roundResponseController.submitResponse);

// @route   PUT api/round-responses/:id/review
// @desc    Review a round response
// @access  Private (Organizer only)
router.put('/:id/review',
    protect,
    authorize('organizer', 'admin'),
    roundResponseController.reviewResponse
);

// @route   GET api/round-responses/hackathon/:hackathonId/round/:roundId
// @desc    Get user's response for a specific round
// @access  Private
router.get('/hackathon/:hackathonId/round/:roundId', protect, roundResponseController.getUserResponse);

// @route   GET api/round-responses/hackathon/:hackathonId/round/:roundId/all
// @desc    Get all responses for a round (organizer only)
// @access  Private
router.get('/hackathon/:hackathonId/round/:roundId/all',
    protect,
    authorize('organizer', 'admin'),
    roundResponseController.getAllResponses
);

// @route   GET api/round-responses/hackathon/:hackathonId/round/:roundId/qualification
// @desc    Check if user is qualified for next round
// @access  Private
router.get('/hackathon/:hackathonId/round/:roundId/qualification',
    protect,
    roundResponseController.checkRoundQualification
);

// @route   POST api/round-responses/:id/upload-file
// @desc    Upload a file for a round response
// @access  Private
router.post('/:id/upload-file',
    protect,
    uploadSingleFile('file'),
    roundResponseController.uploadResponseFile
);

module.exports = router; 