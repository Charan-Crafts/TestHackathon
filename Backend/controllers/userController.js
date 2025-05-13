const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        // Query parameters for filtering and pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await User.countDocuments();

        const query = {};

        // Filter by role if provided
        if (req.query.role) {
            query.role = req.query.role;
        }

        // Filter by active status if provided
        if (req.query.isActive) {
            query.isActive = req.query.isActive === 'true';
        }

        // Execute query with pagination
        const users = await User.find(query)
            .select('-password')
            .skip(startIndex)
            .limit(limit);

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: users.length,
            pagination,
            data: users
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
    try {
        const { email, firstName, lastName, role, password, gender, phoneNumber } = req.body;

        // Validate role
        const allowedRoles = ['candidate', 'organizer', 'admin'];
        if (role && !allowedRoles.includes(role)) {
            return next(new ErrorResponse(`Role must be one of ${allowedRoles.join(', ')}`, 400));
        }

        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!user) {
            return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
        }

        await user.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Change user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.changeUserRole = async (req, res, next) => {
    try {
        if (!req.body.role) {
            return next(new ErrorResponse('Please provide a role', 400));
        }

        const allowedRoles = ['candidate', 'organizer', 'admin'];
        if (!allowedRoles.includes(req.body.role)) {
            return next(new ErrorResponse(`Role ${req.body.role} is not valid`, 400));
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!user) {
            return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Activate/Deactivate user
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.changeUserStatus = async (req, res, next) => {
    try {
        if (req.body.isActive === undefined) {
            return next(new ErrorResponse('Please provide isActive status', 400));
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: req.body.isActive },
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!user) {
            return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
}; 