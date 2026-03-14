const express = require('express');
const { getEnrolledCourses, updateProgress } = require('../controllers/student');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/courses').get(protect, getEnrolledCourses);
router.route('/courses/:courseId/progress').post(protect, updateProgress);

module.exports = router;
