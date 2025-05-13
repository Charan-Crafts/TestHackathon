const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getMyProfile,
    createOrUpdateProfile,
    uploadProfileFile,
    deleteProfileFile,
    updateSkills,
    updateEducation,
    updateExperience,
    updateCertifications,
    updateAchievements,
    updateSocials
} = require('../controllers/profileController');
const { uploadSingleFile } = require('../middleware/fileUpload');

// Get my profile
router.get('/me', protect, getMyProfile);

// Create or update profile
router.post('/', protect, createOrUpdateProfile);

// Upload profile file (resume, certificate, achievement)
router.post('/upload', protect, uploadSingleFile('file'), uploadProfileFile);

// Delete profile file
router.delete('/files/:fileId', protect, deleteProfileFile);

// Update skills
router.patch('/skills', protect, updateSkills);

// Update education
router.patch('/education', protect, updateEducation);

// Update experience
router.patch('/experience', protect, updateExperience);

// Update certifications
router.patch('/certifications', protect, updateCertifications);

// Update achievements
router.patch('/achievements', protect, updateAchievements);

// Update socials
router.patch('/socials', protect, updateSocials);

module.exports = router; 