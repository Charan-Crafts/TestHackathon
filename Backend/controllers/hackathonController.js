const Hackathon = require('../models/Hackathon');
const HackathonApplication = require('../models/HackathonApplication');
const User = require('../models/User');
const File = require('../models/File');

/**
 * @desc    Get all hackathons with pagination and filtering
 * @route   GET /api/hackathons
 * @access  Public
 */
exports.getHackathons = async (req, res) => {
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

        // Filter by category
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Filter by search term
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }

        // Filter by organizer (for admin view)
        if (req.query.organizer) {
            filter.organizerId = req.query.organizer;
        }

        // Execute query with pagination
        const hackathons = await Hackathon.find(filter)
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        // Get total documents
        const total = await Hackathon.countDocuments(filter);

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            count: hackathons.length,
            pagination: {
                total,
                page,
                limit,
                totalPages
            },
            data: hackathons
        });
    } catch (error) {
        console.error('Error getting hackathons:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get hackathons',
            error: error.message
        });
    }
};

/**
 * @desc    Get single hackathon by ID
 * @route   GET /api/hackathons/:id
 * @access  Public
 */
exports.getHackathon = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id)
            .populate('organizerId', 'firstName lastName email');

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        // Increment view count
        hackathon.viewCount += 1;
        await hackathon.save();

        return res.status(200).json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        console.error('Error getting hackathon:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get hackathon',
            error: error.message
        });
    }
};

/**
 * @desc    Create new hackathon
 * @route   POST /api/hackathons
 * @access  Private (Organizers/Admins)
 */
exports.createHackathon = async (req, res, next) => {
    try {
        // Add organizer ID from authenticated user
        req.body.organizerId = req.user.id;

        // Debug: Log req.files to see uploaded files
        console.log('req.files in createHackathon:', req.files);

        // Convert numeric fields
        if (req.body.maxTeamSize) {
            req.body.maxTeamSize = parseInt(req.body.maxTeamSize, 10);
        }
        if (req.body.participants) {
            req.body.participants = parseInt(req.body.participants, 10);
        }
        if (req.body.prize) {
            req.body.prize = parseInt(req.body.prize, 10);
        }
        // Convert academic prerequisite fields
        if (req.body.tenthMarks) {
            req.body.tenthMarks = parseFloat(req.body.tenthMarks);
        }
        if (req.body.twelfthMarks) {
            req.body.twelfthMarks = parseFloat(req.body.twelfthMarks);
        }

        // Check if required fields are provided
        const requiredFields = [
            'title', 'description', 'longDescription', 'aboutEvent',
            'startDate', 'endDate', 'registrationDeadline',
            'locationType', 'category', 'maxTeamSize', 'prize'
        ];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `Please provide ${field}`
                });
            }
        }

        // Parse JSON fields if they are strings (from FormData)
        const parseIfString = (field) => {
            if (typeof req.body[field] === 'string') {
                try {
                    return JSON.parse(req.body[field]);
                } catch {
                    return req.body[field];
                }
            }
            return req.body[field];
        };

        req.body.registrationFees = parseIfString('registrationFees');
        req.body.rounds = parseIfString('rounds');
        req.body.prizeDetails = parseIfString('prizeDetails');
        req.body.judges = parseIfString('judges');
        req.body.faqs = parseIfString('faqs');
        req.body.coOrganizers = parseIfString('coOrganizers');

        // Clean up coOrganizers array
        if (req.body.coOrganizers) {
            try {
                // Ensure it's an array
                if (!Array.isArray(req.body.coOrganizers)) {
                    req.body.coOrganizers = [];
                } else {
                    // Clean up each co-organizer
                    req.body.coOrganizers = req.body.coOrganizers
                        .filter(org => org && typeof org === 'object')
                        .map(org => ({
                            name: org.name || '',
                            contact: org.contact || '',
                            email: org.email || ''
                        }))
                        .filter(org => org.name && org.email); // Only keep valid entries
                }
            } catch (error) {
                console.error('Error processing coOrganizers:', error);
                req.body.coOrganizers = [];
            }
        } else {
            req.body.coOrganizers = [];
        }

        // Clean up judges array
        if (req.body.judges && Array.isArray(req.body.judges)) {
            req.body.judges = req.body.judges
                .filter(judge => judge.name && judge.title) // Remove empty judges
                .map(judge => {
                    // Remove empty image field
                    if (!judge.image) {
                        delete judge.image;
                    }
                    return judge;
                });
        }

        // Clean up FAQs array
        if (req.body.faqs && Array.isArray(req.body.faqs)) {
            req.body.faqs = req.body.faqs.filter(faq => faq.question && faq.answer);
        }

        // Clean up prize details
        if (req.body.prizeDetails && Array.isArray(req.body.prizeDetails)) {
            req.body.prizeDetails = req.body.prizeDetails
                .filter(prize => prize.place && prize.amount)
                .map(prize => ({
                    ...prize,
                    amount: parseInt(prize.amount, 10) || 0
                }));
        }

        // Validate rounds if provided
        if (req.body.rounds && Array.isArray(req.body.rounds)) {
            req.body.rounds = req.body.rounds.map(round => ({
                ...round,
                status: 'pending'
            }));

            for (const round of req.body.rounds) {
                // Validate required round fields
                if (!round.name || !round.startDate || !round.endDate) {
                    return res.status(400).json({
                        success: false,
                        message: 'Each round must have a name, start date, and end date'
                    });
                }

                // Set default times if not provided
                if (!round.startTime) {
                    round.startTime = '06:00';
                }
                if (!round.endTime) {
                    round.endTime = '21:00';
                }

                // Ensure round has an id field
                if (!round.id) {
                    round.id = `round-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                }

                // Validate time format
                if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(round.startTime)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid start time format. Use HH:MM format'
                    });
                }

                if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(round.endTime)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid end time format. Use HH:MM format'
                    });
                }

                // Validate platform link if provided
                if (round.platformLink && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(round.platformLink)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid platform link format'
                    });
                }

                // Validate submission type
                if (round.submissionType && !['github', 'file', 'pdf', 'video', 'assessment'].includes(round.submissionType)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid submission type'
                    });
                }

                // Clean up evaluation criteria
                if (round.evaluationCriteria && Array.isArray(round.evaluationCriteria)) {
                    round.evaluationCriteria = round.evaluationCriteria
                        .filter(criteria => criteria.name && typeof criteria.weight === 'number')
                        .map(criteria => ({
                            ...criteria,
                            weight: Math.min(Math.max(criteria.weight, 0), 100)
                        }));
                }
            }
        }

        // Handle image file (support both single and fields upload)
        if (req.file) {
            req.body.imagePath = `/uploads/${req.file.filename}`;
        } else if (req.files && req.files.image && req.files.image.length > 0) {
            req.body.imagePath = `/uploads/${req.files.image[0].filename}`;
        } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('http')) {
            req.body.imagePath = req.body.image;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Hackathon image is required'
            });
        }

        // Handle brochure file (optional)
        if (req.files && req.files.brochure && req.files.brochure.length > 0) {
            console.log('Brochure file found:', req.files.brochure[0]); // Debug brochure file details
            req.body.brochurePath = `/uploads/${req.files.brochure[0].filename}`;
        }

        // Remove old fields if they exist
        delete req.body.image;
        delete req.body.imageFile;
        delete req.body.brochureFile;
        delete req.body.brochurePreview;

        // Create hackathon
        const hackathon = await Hackathon.create(req.body);

        res.status(201).json({
            success: true,
            data: hackathon
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Update hackathon
 * @route   PUT /api/hackathons/:id
 * @access  Private (Organizer who created the hackathon or Admin)
 */
exports.updateHackathon = async (req, res) => {
    try {
        let hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        // Debug: Log req.files to see uploaded files
        console.log('req.files in updateHackathon:', req.files);

        // Check ownership or admin access
        if (hackathon.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this hackathon'
            });
        }

        // Check hackathon status - don't allow updates for completed hackathons
        if (hackathon.status === 'Completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot update a completed hackathon'
            });
        }

        // Validate rounds if provided in update
        if (req.body.rounds && Array.isArray(req.body.rounds)) {
            req.body.rounds = req.body.rounds.map(round => ({
                ...round,
                status: round.status === 'completed' ? 'completed' : 'pending'
            }));

            for (const round of req.body.rounds) {
                // Validate required round fields
                if (!round.name || !round.startDate || !round.endDate) {
                    return res.status(400).json({
                        success: false,
                        message: 'Each round must have a name, start date, and end date'
                    });
                }

                // Ensure round has an id field
                if (!round.id) {
                    round.id = `round-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                }

                // Validate time format
                if (round.startTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(round.startTime)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid start time format. Use HH:MM format'
                    });
                }

                if (round.endTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(round.endTime)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid end time format. Use HH:MM format'
                    });
                }

                // Validate platform link if provided
                if (round.platformLink && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(round.platformLink)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid platform link format'
                    });
                }

                // Validate submission type
                if (round.submissionType && !['github', 'file', 'pdf', 'video', 'assessment'].includes(round.submissionType)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid submission type'
                    });
                }

                // Validate evaluation criteria if provided
                if (round.evaluationCriteria && Array.isArray(round.evaluationCriteria)) {
                    for (const criteria of round.evaluationCriteria) {
                        if (!criteria.name || typeof criteria.weight !== 'number' || criteria.weight < 0 || criteria.weight > 100) {
                            return res.status(400).json({
                                success: false,
                                message: 'Each evaluation criteria must have a name and a weight between 0 and 100'
                            });
                        }
                    }
                }
            }
        }

        // Handle image file (support both single and fields upload)
        if (req.file) {
            req.body.imagePath = `/uploads/${req.file.filename}`;
        } else if (req.files && req.files.image && req.files.image.length > 0) {
            req.body.imagePath = `/uploads/${req.files.image[0].filename}`;
        }

        // Handle brochure file (optional)
        if (req.files && req.files.brochure && req.files.brochure.length > 0) {
            console.log('Brochure file found:', req.files.brochure[0]); // Debug brochure file details
            req.body.brochurePath = `/uploads/${req.files.brochure[0].filename}`;
        }

        // Remove old fields if they exist
        delete req.body.image;
        delete req.body.imageFile;
        delete req.body.brochureFile;
        delete req.body.brochurePreview;

        // Update hackathon
        hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        console.error('Error updating hackathon:', error);

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
            message: 'Failed to update hackathon',
            error: error.message
        });
    }
};

/**
 * @desc    Delete hackathon
 * @route   DELETE /api/hackathons/:id
 * @access  Private (Organizer who created the hackathon or Admin)
 */
exports.deleteHackathon = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        // Check ownership or admin access
        if (hackathon.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this hackathon'
            });
        }

        // Check if hackathon has participants or submissions
        if (hackathon.registrationCount > 0 || hackathon.submissionCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete a hackathon with active participants or submissions'
            });
        }

        await hackathon.remove();

        return res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting hackathon:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete hackathon',
            error: error.message
        });
    }
};

/**
 * @desc    Upload hackathon image
 * @route   POST /api/hackathons/:id/upload-image
 * @access  Private (Organizer who created the hackathon or Admin)
 */
exports.uploadHackathonImage = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        // Check ownership or admin access
        if (hackathon.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this hackathon'
            });
        }

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file'
            });
        }

        // Update hackathon with new image path
        hackathon.imagePath = `/uploads/${req.file.filename}`;
        await hackathon.save();

        return res.status(200).json({
            success: true,
            data: {
                imagePath: hackathon.imagePath
            }
        });
    } catch (error) {
        console.error('Error uploading hackathon image:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload hackathon image',
            error: error.message
        });
    }
};

/**
 * @desc    Review hackathon (approve/reject) - Admin only
 * @route   PUT /api/hackathons/:id/review
 * @access  Private (Admin)
 */
exports.reviewHackathon = async (req, res) => {
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

        let hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        // Update hackathon status
        hackathon.status = status;
        hackathon.reviewedBy = req.user.id;
        hackathon.reviewedAt = Date.now();

        if (status === 'rejected') {
            hackathon.rejectionReason = rejectionReason;
        } else {
            hackathon.rejectionReason = undefined;
        }

        if (notes) {
            hackathon.notes = notes;
        }

        await hackathon.save();

        // Notify the organizer (in a real implementation, send an email)

        return res.status(200).json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        console.error('Error reviewing hackathon:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to review hackathon',
            error: error.message
        });
    }
};

/**
 * @desc    Get hackathons organized by the current user
 * @route   GET /api/hackathons/my-hackathons
 * @access  Private (Organizer/Admin)
 */
exports.getMyHackathons = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Get hackathons created by this user
        const hackathons = await Hackathon.find({ organizerId: req.user.id })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        // Get total documents
        const total = await Hackathon.countDocuments({ organizerId: req.user.id });

        // Calculate total pages
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            count: hackathons.length,
            pagination: {
                total,
                page,
                limit,
                totalPages
            },
            data: hackathons
        });
    } catch (error) {
        console.error('Error getting my hackathons:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get hackathons',
            error: error.message
        });
    }
};

exports.activateRound = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        // Only allow activation if no other round is active
        const hasActiveRound = hackathon.rounds.some(r => r.status === 'active');
        if (hasActiveRound) {
            return res.status(400).json({
                success: false,
                message: 'Cannot activate a new round while another round is active'
            });
        }

        let found = false;
        hackathon.rounds = hackathon.rounds.map(r => {
            if ((r._id && r._id.toString() === req.params.roundId) || r.id === req.params.roundId) {
                found = true;
                return {
                    ...r.toObject(),
                    status: 'active',
                    isActive: true,
                    activationTime: new Date(),
                };
            } else if (r.status !== 'completed') {
                return {
                    ...r.toObject(),
                    status: 'pending',
                    isActive: false,
                };
            } else {
                return {
                    ...r.toObject(),
                    isActive: false,
                };
            }
        });
        if (!found) {
            return res.status(404).json({
                success: false,
                message: 'Round not found'
            });
        }
        await hackathon.save();
        const activatedRound = hackathon.rounds.find(r => r.status === 'active');
        return res.status(200).json({
            success: true,
            data: activatedRound
        });
    } catch (error) {
        console.error('Error activating round:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to activate round',
            error: error.message
        });
    }
};

exports.completeRound = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: 'Hackathon not found'
            });
        }

        let found = false;
        hackathon.rounds = hackathon.rounds.map(r => {
            if ((r._id && r._id.toString() === req.params.roundId) || r.id === req.params.roundId) {
                if (r.status !== 'active') {
                    found = 'not_active';
                    return r;
                }
                found = true;
                return {
                    ...r.toObject(),
                    status: 'completed',
                    isActive: false,
                    completionTime: new Date(),
                };
            }
            return r;
        });
        if (found === 'not_active') {
            return res.status(400).json({
                success: false,
                message: 'Only active rounds can be completed'
            });
        }
        if (!found) {
            return res.status(404).json({
                success: false,
                message: 'Round not found'
            });
        }
        await hackathon.save();
        const completedRound = hackathon.rounds.find(r => (r._id && r._id.toString() === req.params.roundId) || r.id === req.params.roundId);
        return res.status(200).json({
            success: true,
            data: completedRound
        });
    } catch (error) {
        console.error('Error completing round:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to complete round',
            error: error.message
        });
    }
};

/**
 * @desc    Submit a solution for a round (per-user)
 * @route   POST /api/hackathons/:id/rounds/:roundId/submit
 * @access  Private (Registered users)
 */
exports.submitRoundSolution = async (req, res) => {
    try {
        const hackathon = await require('../models/Hackathon').findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ success: false, message: 'Hackathon not found' });
        }

        // Find the round
        const round = hackathon.rounds.id(req.params.roundId) ||
            hackathon.rounds.find(r => r.id === req.params.roundId);
        if (!round) {
            return res.status(404).json({ success: false, message: 'Round not found' });
        }

        // Check if user already submitted
        if (round.submissions.some(sub => sub.user.toString() === req.user.id)) {
            return res.status(400).json({ success: false, message: 'You have already submitted for this round.' });
        }

        // Add submission
        round.submissions.push({
            user: req.user.id,
            link: req.body.link,
            status: 'submitted'
        });

        await hackathon.save();

        return res.status(200).json({ success: true, message: 'Submission recorded.' });
    } catch (error) {
        console.error('Error submitting round solution:', error);
        return res.status(500).json({ success: false, message: 'Failed to submit solution', error: error.message });
    }
};

/**
 * @desc    Check if user has submitted for a round
 * @route   GET /api/hackathons/:id/rounds/:roundId/submission-status
 * @access  Private
 */
exports.getRoundSubmissionStatus = async (req, res) => {
    try {
        const hackathon = await require('../models/Hackathon').findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ success: false, message: 'Hackathon not found' });
        }

        const round = hackathon.rounds.id(req.params.roundId) ||
            hackathon.rounds.find(r => r.id === req.params.roundId);
        if (!round) {
            return res.status(404).json({ success: false, message: 'Round not found' });
        }

        const submission = round.submissions.find(sub => sub.user.toString() === req.user.id);

        return res.status(200).json({
            success: true,
            submitted: !!submission,
            submission
        });
    } catch (error) {
        console.error('Error checking round submission status:', error);
        return res.status(500).json({ success: false, message: 'Failed to check submission status', error: error.message });
    }
};

/**
 * @desc    Set the status of a round (pending, active, completed)
 * @route   PUT /api/hackathons/:id/rounds/:roundId/status
 * @access  Private (Organizer/Admin)
 */
exports.setRoundStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'pending', 'active', 'completed'
        if (!['pending', 'active', 'completed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        const hackathon = await require('../models/Hackathon').findById(req.params.id);
        if (!hackathon) {
            return res.status(404).json({ success: false, message: 'Hackathon not found' });
        }
        const round = hackathon.rounds.id(req.params.roundId) ||
            hackathon.rounds.find(r => r.id === req.params.roundId);
        if (!round) {
            return res.status(404).json({ success: false, message: 'Round not found' });
        }
        round.status = status;
        if (status === 'active') {
            round.isActive = true;
            round.activationTime = new Date();
        } else if (status === 'completed') {
            round.isActive = false;
            round.completionTime = new Date();
        } else if (status === 'pending') {
            round.isActive = false;
            round.activationTime = undefined;
            round.completionTime = undefined;
        }
        await hackathon.save();
        return res.status(200).json({ success: true, data: round });
    } catch (error) {
        console.error('Error setting round status:', error);
        return res.status(500).json({ success: false, message: 'Failed to set round status', error: error.message });
    }
}; 