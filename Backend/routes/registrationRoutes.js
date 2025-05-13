const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// Create a new registration
router.post('/', registrationController.createRegistration);

// Get all registrations (optionally filter by hackathonId or userId)
router.get('/', registrationController.getRegistrations);

// Get a single registration by ID
router.get('/:id', registrationController.getRegistrationById);

// Approve or reject a registration
router.put('/:id/review', registrationController.reviewRegistration);

module.exports = router; 