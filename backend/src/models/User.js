const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Please add a valid 10-digit phone number']
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  notificationPreferences: {
    securityAlerts: { type: Boolean, default: true },
    courseUpdates: { type: Boolean, default: true },
    promoOffers: { type: Boolean, default: false },
    weeklyNewsletter: { type: Boolean, default: false }
  },
  paymentMethods: [{
    brand: { type: String, default: 'Card' },
    last4: { type: String, required: true },
    expiryMonth: { type: Number, min: 1, max: 12, required: true },
    expiryYear: { type: Number, min: 2000, required: true },
    holderName: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
const crypto = require('crypto');
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
