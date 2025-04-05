const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// Import user controller (we'll create it next)
const userController = require('../controllers/user.controller');

// All routes in this file are protected and require authentication
router.use(protect);

// Admin-only routes (dean and director)
router.route('/')
  .get(authorize('dean', 'director'), userController.getAllUsers)
  .post(authorize('dean'), userController.createUser);

router.route('/:id')
  .get(authorize('dean', 'director'), userController.getUser)
  .put(authorize('dean'), userController.updateUser)
  .delete(authorize('dean'), userController.deleteUser);

// User profile route - any authenticated user can access their own profile
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;