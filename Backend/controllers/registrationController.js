const Registration = require('../models/Registration');

// Create a new registration
exports.createRegistration = async (req, res) => {
    try {
        const registration = await Registration.create(req.body);
        res.status(201).json({ success: true, data: registration });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all registrations (optionally filter by hackathonId or userId)
exports.getRegistrations = async (req, res) => {
    try {
        const filter = {};
        if (req.query.hackathonId) filter.hackathonId = req.query.hackathonId;
        if (req.query.userId) filter.userId = req.query.userId;
        const registrations = await Registration.find(filter)
            .populate('hackathonId')
            .populate('userId');
        res.status(200).json({ success: true, data: registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get a single registration by ID
exports.getRegistrationById = async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id)
            .populate('hackathonId')
            .populate('userId');
        if (!registration) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }
        res.status(200).json({ success: true, data: registration });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Approve or reject a registration
exports.reviewRegistration = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        const registration = await Registration.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!registration) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }
        res.status(200).json({ success: true, data: registration });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}; 