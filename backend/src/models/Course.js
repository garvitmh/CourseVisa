const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  subjectId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['kindergarten', 'highschool', 'college', 'computer', 'science', 'engineering']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false
  },
  videos: [{
    title: String,
    videoUrl: String,
    duration: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
