const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole,
    changeUserStatus
} = require('../controllers/userController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);
// Apply admin authorization to all routes
router.use(authorize('admin'));

// Routes for user management
router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

router.put('/:id/role', changeUserRole);
router.put('/:id/status', changeUserStatus);

module.exports = router; 