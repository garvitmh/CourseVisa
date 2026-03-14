const express = require('express');
const {
  getUsers,
  updateUserStatus,
  getCourses,
  deleteCourse,
  getApplications,
  updateApplicationStatus,
  getEnrollments,
  grantEnrollment,
  revokeEnrollment
} = require('../controllers/admin');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect and authorize all admin routes
router.use(protect);
router.use(authorize('admin'));

// Route: /api/v1/admin/users
router.route('/users')
  .get(getUsers);

// Route: /api/v1/admin/users/:id/status
router.route('/users/:id/status')
  .put(updateUserStatus);

// Route: /api/v1/admin/courses
router.route('/courses')
  .get(getCourses);

// Route: /api/v1/admin/courses/:id
router.route('/courses/:id')
  .delete(deleteCourse);

// Route: /api/v1/admin/applications
router.route('/applications')
  .get(getApplications);

// Route: /api/v1/admin/applications/:id/status
router.route('/applications/:id/status')
  .put(updateApplicationStatus);

// Route: /api/v1/admin/enrollments
router.route('/enrollments')
  .get(getEnrollments)
  .post(grantEnrollment);

// Route: /api/v1/admin/enrollments/:id
router.route('/enrollments/:id')
  .delete(revokeEnrollment);

module.exports = router;
