const ErrorResponse = require('../utils/errorResponse');
const VerificationRequest = require('../models/VerificationRequest');
const User = require('../models/User');
const File = require('../models/File');

// @desc    Submit a verification request
// @route   POST /api/verifications
// @access  Private
exports.submitVerificationRequest = async (req, res, next) => {
    try {
        // Check if user already has a pending or approved verification
        const existingRequest = await VerificationRequest.findOne({
            userId: req.user.id,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingRequest) {
            if (existingRequest.status === 'pending') {
                return next(new ErrorResponse('You already have a pending verification request', 400));
            } else {
                return next(new ErrorResponse('You are already verified as an organizer', 400));
            }
        }

        // Create verification request with current user ID
        const verificationData = {
            ...req.body,
            userId: req.user.id
        };

        const verificationRequest = await VerificationRequest.create(verificationData);

        res.status(201).json({
            success: true,
            data: verificationRequest
        });
    } catch (err) {
        console.error('Verification submission error:', err);
        next(err);
    }
};

// @desc    Upload ID proofs for verification
// @route   POST /api/verifications/upload-proofs
// @access  Private
exports.uploadVerificationProofs = async (req, res, next) => {
    try {
        // Ensure both files were uploaded
        if (!req.files || !req.files.photoIdProof || !req.files.organizationIdProof) {
            return next(new ErrorResponse('Please upload both photo ID and organization ID proofs', 400));
        }

        const photoIdProofFile = req.files.photoIdProof[0];
        const organizationIdProofFile = req.files.organizationIdProof[0];

        // Create file records for the uploaded files
        const photoIdProof = await File.create({
            fileName: photoIdProofFile.filename,
            originalName: photoIdProofFile.originalname,
            filePath: photoIdProofFile.path,
            fileSize: photoIdProofFile.size,
            fileType: photoIdProofFile.mimetype,
            uploadedBy: req.user.id,
            entityType: 'user',
            isPublic: false,
            tags: ['id-proof', 'verification']
        });

        const organizationIdProof = await File.create({
            fileName: organizationIdProofFile.filename,
            originalName: organizationIdProofFile.originalname,
            filePath: organizationIdProofFile.path,
            fileSize: organizationIdProofFile.size,
            fileType: organizationIdProofFile.mimetype,
            uploadedBy: req.user.id,
            entityType: 'user',
            isPublic: false,
            tags: ['organization-proof', 'verification']
        });

        res.status(201).json({
            success: true,
            data: {
                photoIdProof: photoIdProof._id,
                organizationIdProof: organizationIdProof._id
            }
        });
    } catch (err) {
        console.error('Proof upload error:', err);
        next(err);
    }
};

// @desc    Get current user's verification status
// @route   GET /api/verifications/me
// @access  Private
exports.getMyVerification = async (req, res, next) => {
    try {
        const verificationRequest = await VerificationRequest.findOne({
            userId: req.user.id
        })
            .populate('photoIdProofFile')
            .populate('organizationIdProofFile');

        if (!verificationRequest) {
            return res.status(404).json({
                success: false,
                message: 'You have not submitted a verification request yet'
            });
        }

        res.status(200).json({
            success: true,
            data: verificationRequest
        });
    } catch (err) {
        console.error('Get verification error:', err);
        next(err);
    }
};

// @desc    Get all verification requests (admin only)
// @route   GET /api/verifications
// @access  Private/Admin
exports.getVerificationRequests = async (req, res, next) => {
    try {
        // Define query parameters
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const status = req.query.status; // Filter by status if provided

        // Build query
        const query = {};
        if (status) {
            query.status = status;
        }

        // Get total count
        const total = await VerificationRequest.countDocuments(query);

        // Execute query with pagination
        const verificationRequests = await VerificationRequest.find(query)
            .populate('userId', 'firstName lastName email')
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({
            success: true,
            count: verificationRequests.length,
            total,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasMore: startIndex + limit < total
            },
            data: verificationRequests
        });
    } catch (err) {
        console.error('Get all verifications error:', err);
        next(err);
    }
};

// @desc    Get a single verification request (admin only)
// @route   GET /api/verifications/:id
// @access  Private/Admin
exports.getVerificationRequest = async (req, res, next) => {
    try {
        const verificationRequest = await VerificationRequest.findById(req.params.id)
            .populate('userId', 'firstName lastName email')
            .populate('photoIdProofFile')
            .populate('organizationIdProofFile');

        if (!verificationRequest) {
            return next(new ErrorResponse(`Verification request not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: verificationRequest
        });
    } catch (err) {
        console.error('Get verification request error:', err);
        next(err);
    }
};

// @desc    Approve or reject a verification request (admin only)
// @route   PUT /api/verifications/:id/review
// @access  Private/Admin
exports.reviewVerificationRequest = async (req, res, next) => {
    try {
        const { status, notes, rejectionReason } = req.body;

        if (!status || !['approved', 'rejected'].includes(status)) {
            return next(new ErrorResponse('Please provide a valid status (approved or rejected)', 400));
        }

        // If rejecting, require a reason
        if (status === 'rejected' && !rejectionReason) {
            return next(new ErrorResponse('Please provide a reason for rejection', 400));
        }

        const verificationRequest = await VerificationRequest.findById(req.params.id);

        if (!verificationRequest) {
            return next(new ErrorResponse(`Verification request not found with id of ${req.params.id}`, 404));
        }

        // Update verification request
        verificationRequest.status = status;
        verificationRequest.reviewedBy = req.user.id;
        verificationRequest.reviewedAt = Date.now();
        verificationRequest.notes = notes || verificationRequest.notes;
        verificationRequest.rejectionReason = rejectionReason || verificationRequest.rejectionReason;

        // Set isApproved based on status
        verificationRequest.isApproved = (status === 'approved');

        await verificationRequest.save();

        // If approved, update user's role to organizer
        if (status === 'approved') {
            await User.findByIdAndUpdate(verificationRequest.userId, { role: 'organizer' });
        }

        res.status(200).json({
            success: true,
            data: verificationRequest
        });
    } catch (err) {
        console.error('Review verification error:', err);
        next(err);
    }
};

// @desc    Get verification status for the current user
// @route   GET /api/verifications/status
// @access  Private
exports.getVerificationStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Find verification request for the current user
        const verificationRequest = await VerificationRequest.findOne({ userId });

        if (!verificationRequest) {
            return res.status(404).json({
                success: false,
                error: 'No verification request found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                status: verificationRequest.status,
                isApproved: verificationRequest.isApproved,
                submittedAt: verificationRequest.createdAt,
                updatedAt: verificationRequest.updatedAt,
                feedback: verificationRequest.rejectionReason || null
            }
        });
    } catch (error) {
        console.error('Error getting verification status:', error);
        next(error);
    }
}; 