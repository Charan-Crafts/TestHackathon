const Profile = require('../models/Profile');
const User = require('../models/User');
const File = require('../models/File');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user profile (auto-create if not exists)
// @route   GET /api/profiles/me
// @access  Private
exports.getMyProfile = asyncHandler(async (req, res, next) => {
    let profile = await Profile.findOne({ user: req.user.id })
        .populate('user', 'firstName lastName email');

    // If no profile, create a default one
    if (!profile) {
        const user = await User.findById(req.user.id);
        profile = await Profile.create({
            user: user._id,
            title: '',
            bio: '',
            location: '',
            website: '',
            socials: [],
            education: [],
            experience: [],
            skills: [],
            certifications: [],
            achievements: [],
            stats: {},
            resume: '',
            phone: '',
            email: user.email || '',
        });
        // Populate user fields for response
        await profile.populate('user', 'firstName lastName email');
    }

    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Create or update user profile
// @route   POST /api/profiles
// @access  Private
exports.createOrUpdateProfile = asyncHandler(async (req, res, next) => {
    const {
        title,
        bio,
        location,
        website,
        socials,
        education,
        experience,
        skills,
        phone
    } = req.body;

    // Build profile object
    const profileFields = {
        user: req.user.id,
        title,
        bio,
        location,
        website,
        socials,
        education,
        experience,
        skills,
        phone
    };

    // Update profile
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, runValidators: true }
        );
    } else {
        // Create
        profile = await Profile.create(profileFields);
    }

    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Upload profile file (resume, certificate, achievement)
// @route   POST /api/profiles/upload
// @access  Private
exports.uploadProfileFile = asyncHandler(async (req, res, next) => {
    const { type, name, issuer, description, date } = req.body;

    // If no file was uploaded, return an error
    if (!req.file) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    console.log('Processing file upload:', {
        type,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        location: req.file.location
    });

    // Create file record
    const file = await File.create({
        fileName: req.file.originalname,
        originalName: req.file.originalname,
        filePath: req.file.location,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        uploadedBy: req.user.id
    });

    // Update profile based on file type
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    switch (type) {
        case 'resume':
            profile.resume = req.file.location;
            break;
        case 'certification':
            profile.certifications.push({
                name,
                issuer,
                date,
                file: req.file.location
            });
            break;
        case 'achievement':
            profile.achievements.push({
                name,
                description,
                date,
                file: req.file.location
            });
            break;
        default:
            return next(new ErrorResponse('Invalid file type', 400));
    }

    await profile.save();

    res.status(200).json({
        success: true,
        data: {
            file,
            profile
        }
    });
});

// @desc    Delete profile file
// @route   DELETE /api/profiles/files/:fileId
// @access  Private
exports.deleteProfileFile = asyncHandler(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    const file = await File.findById(req.params.fileId);
    if (!file) {
        return next(new ErrorResponse('File not found', 404));
    }

    // Check if user owns the file
    if (file.uploadedBy.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to delete this file', 401));
    }

    // Remove file reference from profile
    if (profile.resume === file.path) {
        profile.resume = null;
    } else {
        profile.certifications = profile.certifications.filter(
            cert => cert.file !== file.path
        );
        profile.achievements = profile.achievements.filter(
            achievement => achievement.file !== file.path
        );
    }

    await profile.save();
    await file.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Add or update skills
// @route   PATCH /api/profiles/skills
// @access  Private
exports.updateSkills = asyncHandler(async (req, res, next) => {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
        return next(new ErrorResponse('Skills must be an array', 400));
    }
    const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: { skills } },
        { new: true, runValidators: true }
    );
    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }
    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Update education
// @route   PATCH /api/profiles/education
// @access  Private
exports.updateEducation = asyncHandler(async (req, res, next) => {
    const { education } = req.body;
    if (!Array.isArray(education)) {
        return next(new ErrorResponse('Education must be an array', 400));
    }
    const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: { education } },
        { new: true, runValidators: true }
    );
    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }
    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Update experience
// @route   PATCH /api/profiles/experience
// @access  Private
exports.updateExperience = asyncHandler(async (req, res, next) => {
    const { experience } = req.body;
    if (!Array.isArray(experience)) {
        return next(new ErrorResponse('Experience must be an array', 400));
    }
    const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: { experience } },
        { new: true, runValidators: true }
    );
    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }
    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Update certifications
// @route   PATCH /api/profiles/certifications
// @access  Private
exports.updateCertifications = asyncHandler(async (req, res, next) => {
    const { certifications } = req.body;
    if (!Array.isArray(certifications)) {
        return next(new ErrorResponse('Certifications must be an array', 400));
    }
    const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: { certifications } },
        { new: true, runValidators: true }
    );
    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }
    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Update achievements
// @route   PATCH /api/profiles/achievements
// @access  Private
exports.updateAchievements = asyncHandler(async (req, res, next) => {
    const { achievements } = req.body;
    if (!Array.isArray(achievements)) {
        return next(new ErrorResponse('Achievements must be an array', 400));
    }
    const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: { achievements } },
        { new: true, runValidators: true }
    );
    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }
    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Update socials
// @route   PATCH /api/profiles/socials
// @access  Private
exports.updateSocials = asyncHandler(async (req, res, next) => {
    const { socials } = req.body;
    if (!Array.isArray(socials)) {
        return next(new ErrorResponse('Socials must be an array', 400));
    }
    const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: { socials } },
        { new: true, runValidators: true }
    );
    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }
    res.status(200).json({
        success: true,
        data: profile
    });
}); 