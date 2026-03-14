const MentorApplication = require('../models/MentorApplication');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Submit mentor application
// @route   POST /api/v1/mentor/apply
// @access  Public
exports.submitApplication = async (req, res, next) => {
  try {
    const application = await MentorApplication.create(req.body);

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/v1/mentor/applications
// @access  Private/Admin
exports.getApplications = async (req, res, next) => {
  try {
    const applications = await MentorApplication.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update application status (Approve/Reject)
// @route   PUT /api/v1/mentor/applications/:id
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    let application = await MentorApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    application = await MentorApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    // If approved, upgrade user role to mentor
    if (status === 'accepted') {
      const user = await User.findOne({ email: application.email });
      if (user) {
        user.role = 'mentor';
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: application,
      message: `Application ${status}`
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get stats for the logged-in mentor (students enrolled, earnings)
// @route   GET /api/v1/mentor/stats
// @access  Private/Mentor
exports.getMentorStats = async (req, res, next) => {
  try {
    const myCourses = await Course.find({ instructor: req.user.id });
    const courseIds = myCourses.map(c => c._id);

    const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });

    // Sum price × enrollments per course for total earnings
    let totalEarnings = 0;
    for (const course of myCourses) {
      const count = await Enrollment.countDocuments({ course: course._id });
      totalEarnings += count * (course.price || 0);
    }

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalEarnings,
        rating: 4.8, // Would need a reviews model for real ratings
        totalCourses: myCourses.length,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
