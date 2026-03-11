const User = require('../models/User');
const Course = require('../models/Course');
const Application = require('../models/Application'); // Assume this exists or skip

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update user status (active/suspended)
// @route   PUT /api/v1/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all courses with stats
// @route   GET /api/v1/admin/courses
// @access  Private/Admin
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate({
      path: 'instructor',
      select: 'username email'
    }).sort('-createdAt');

    // Add mock students count for the table since we don't have enrollment model yet
    const enrichedCourses = courses.map(course => {
      const courseObj = course.toObject();
      courseObj.students = Math.floor(Math.random() * 2000) + 100; // Mock stat
      courseObj.status = 'published';
      return courseObj;
    });

    res.status(200).json({
      success: true,
      count: enrichedCourses.length,
      data: enrichedCourses
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete course
// @route   DELETE /api/v1/admin/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get pending mentor applications (Mock)
// @route   GET /api/v1/admin/applications
// @access  Private/Admin
exports.getApplications = async (req, res, next) => {
  try {
    // Since we don't have an Application model yet, return mock data
    const MOCK_APPLICATIONS = [
      { id: 'app_1', name: 'Dr. Sarah Chen', expertise: 'Computer Science', experience: 8, status: 'pending', date: '2023-10-24', resumeUrl: '#' },
      { id: 'app_2', name: 'Michael Rodriguez', expertise: 'UI/UX Design', experience: 5, status: 'accepted', date: '2023-10-22', resumeUrl: '#' },
      { id: 'app_3', name: 'James Wilson', expertise: 'Machine Learning', experience: 2, status: 'rejected', date: '2023-10-20', resumeUrl: '#' },
      { id: 'app_4', name: 'Emma Thompson', expertise: 'Business Strategy', experience: 12, status: 'pending', date: '2023-10-25', resumeUrl: '#' },
    ];
    res.status(200).json({
      success: true,
      count: MOCK_APPLICATIONS.length,
      data: MOCK_APPLICATIONS
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
