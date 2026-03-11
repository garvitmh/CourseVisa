const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getCourses)
  .post(protect, authorize('mentor', 'admin'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('mentor', 'admin'), updateCourse)
  .delete(protect, authorize('mentor', 'admin'), deleteCourse);

module.exports = router;
