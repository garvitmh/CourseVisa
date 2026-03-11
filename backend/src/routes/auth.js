const express = require('express');
const { register, login, getMe, getUsers, googleLogin } = require('../controllers/auth');

const { check, validationResult } = require('express-validator');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Middleware to check validation results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.post('/register', [
  check('username', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], validateResults, register);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], validateResults, login);

router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);
router.post('/google', googleLogin);

module.exports = router;
