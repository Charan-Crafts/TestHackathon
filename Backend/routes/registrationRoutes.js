const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const registrationController = require('../controllers/registrationController');

// Registration routes
router.post('/', protect, registrationController.createRegistration);
router.get('/', protect, registrationController.getRegistrations);
router.get('/:id', protect, registrationController.getRegistrationById);
router.put('/:id/review', protect, registrationController.reviewRegistration);

module.exports = router; 