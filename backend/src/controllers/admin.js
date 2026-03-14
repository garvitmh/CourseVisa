const User = require('../models/User');
const Course = require('../models/Course');
const MentorApplication = require('../models/MentorApplication');
const Enrollment = require('../models/Enrollment');

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

    // Get real enrollment counts for each course
    const enrichedCourses = await Promise.all(courses.map(async course => {
      const courseObj = course.toObject();
      courseObj.students = await Enrollment.countDocuments({ course: course._id });
      courseObj.status = 'published';
      return courseObj;
    }));

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

// @desc    Get all mentor applications (real data)
// @route   GET /api/v1/admin/applications
// @access  Private/Admin
exports.getApplications = async (req, res, next) => {
  try {
    const applications = await MentorApplication.find().sort('-createdAt');
    // Normalize fields to match what the frontend expects
    const data = applications.map(app => ({
      id: app._id,
      _id: app._id,
      name: app.name,
      expertise: app.expertise,
      experience: app.experience,
      status: app.status || 'pending',
      date: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '',
      linkedinUrl: app.linkedinUrl || null,
      email: app.email,
      bio: app.bio,
      qualifications: app.qualifications,
    }));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Approve or reject a mentor application
// @route   PUT /api/v1/admin/applications/:id/status
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    const application = await MentorApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    // If approved, promote the user to mentor role
    if (status === 'accepted') {
      const user = await User.findOne({ email: application.email });
      if (user) { user.role = 'mentor'; await user.save(); }
    }
    res.status(200).json({ success: true, data: application, message: `Application ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all enrollments
// @route   GET /api/v1/admin/enrollments
// @access  Private/Admin
exports.getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'username email')
      .populate('course', 'title category price');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Grant enrollment
// @route   POST /api/v1/admin/enrollments
// @access  Private/Admin
exports.grantEnrollment = async (req, res, next) => {
  try {
    const { userId, courseId } = req.body;
    
    // Check if already enrolled
    const existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'User already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      progress: 0
    });

    res.status(201).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Revoke enrollment
// @route   DELETE /api/v1/admin/enrollments/:id
// @access  Private/Admin
exports.revokeEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }

    await enrollment.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
