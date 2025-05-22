const express = require('express');
const {
    getHackathons,
    getHackathon,
    createHackathon,
    updateHackathon,
    deleteHackathon,
    uploadHackathonImage,
    reviewHackathon,
    getMyHackathons,
    activateRound,
    completeRound,
    submitRoundSolution,
    getRoundSubmissionStatus,
    setRoundStatus
} = require('../controllers/hackathonController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const { uploadSingleFile, uploadFields } = require('../middleware/fileUpload');

const router = express.Router();

// Public routes
router.get('/', getHackathons);
router.get('/:id', getHackathon);

// Organizer routes
router.post('/',
    protect,
    authorize('organizer', 'admin'),
    uploadFields([
        { name: 'image', maxCount: 1 },
        { name: 'brochure', maxCount: 1 }
    ]),
    createHackathon
);

router.put('/:id',
    protect,
    authorize('organizer', 'admin'),
    uploadFields([
        { name: 'image', maxCount: 1 },
        { name: 'brochure', maxCount: 1 }
    ]),
    updateHackathon
);

router.delete('/:id', protect, authorize('organizer', 'admin'), deleteHackathon);

router.post(
    '/:id/upload-image',
    protect,
    authorize('organizer', 'admin'),
    uploadSingleFile('image'),
    uploadHackathonImage
);

router.get('/organizer/my-hackathons', protect, authorize('organizer', 'admin'), getMyHackathons);
router.put('/:id/review', protect, authorize('admin'), reviewHackathon);
router.put('/:id/rounds/:roundId/activate', protect, authorize('organizer', 'admin'), activateRound);
router.put('/:id/rounds/:roundId/complete', protect, authorize('organizer', 'admin'), completeRound);
router.put(
    '/:id/rounds/:roundId/status',
    protect,
    authorize('organizer', 'admin'),
    setRoundStatus
);

// User submits a solution for a round
router.post(
    '/:id/rounds/:roundId/submit',
    protect,
    authorize('user', 'candidate', 'organizer', 'admin'),
    submitRoundSolution
);
// User checks if they have submitted for a round
router.get(
    '/:id/rounds/:roundId/submission-status',
    protect,
    authorize('user', 'candidate', 'organizer', 'admin'),
    getRoundSubmissionStatus
);

module.exports = router; 