const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Get enrolled courses for a student
// @route   GET /api/v1/student/courses
// @access  Private (Student)
exports.getEnrolledCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('course')
      .sort('-enrolledAt');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments.map(e => {
        const totalLessons = e.course.videos ? e.course.videos.length : 0;
        const completedCount = e.completedLessons ? e.completedLessons.length : 0;
        const nextVideoIndex = completedCount < totalLessons ? completedCount : 0;
        const nextLesson = (e.course.videos && e.course.videos[nextVideoIndex]) 
          ? e.course.videos[nextVideoIndex].title 
          : (totalLessons > 0 ? 'Review Course' : 'No Content');

        return {
          id: e.course._id,
          title: e.course.title,
          image: e.course.image,
          description: e.course.description,
          progress: e.progress,
          instructor: e.course.mentorName || 'Unknown',
          nextLesson: nextLesson,
          totalLessons: totalLessons,
          completedLessons: completedCount,
          enrolledAt: e.enrolledAt
        };
      })
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update Course Progress (Mark video complete)
// @route   POST /api/v1/student/courses/:courseId/progress
// @access  Private (Student)
exports.updateProgress = async (req, res, next) => {
  try {
    const { videoId } = req.body;
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: req.params.courseId
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }

    // Add video to completedLessons if not already there
    if (!enrollment.completedLessons.includes(videoId)) {
      enrollment.completedLessons.push(videoId);
      
      // Calculate progress
      const totalVideos = enrollment.course.videos.length;
      if (totalVideos > 0) {
        enrollment.progress = Math.round((enrollment.completedLessons.length / totalVideos) * 100);
      } else {
        enrollment.progress = 100;
      }

      await enrollment.save();
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
