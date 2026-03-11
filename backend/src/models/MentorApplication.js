const mongoose = require('mongoose');

const mentorApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  expertise: {
    type: String,
    required: [true, 'Please add your expertise']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  qualifications: {
    type: String,
    required: [true, 'Please add your qualifications']
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio']
  },
  linkedinUrl: String,
  resumeUrl: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MentorApplication', mentorApplicationSchema);
