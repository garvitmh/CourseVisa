const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, error: 'Please add a password' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      phone
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, error: 'Account is suspended. Please contact support.' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Login with Google (using access_token from @react-oauth/google useGoogleLogin)
// @route   POST /api/v1/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    console.log('Google login attempt with token length:', token ? token.length : 0);
    
    if (!token) {
      return res.status(400).json({ success: false, error: 'Google token is required' });
    }

    // Fetch user profile using the access_token from Google's userinfo endpoint
    console.log('Fetching user info from Google...');
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!googleRes.ok) {
      const errorText = await googleRes.text();
      console.log('Google API error:', googleRes.status, errorText);
      return res.status(401).json({ success: false, error: 'Invalid Google access token' });
    }

    const googleUser = await googleRes.json();
    console.log('Google User Info received for:', googleUser.email);
    const { name, email, sub } = googleUser;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Could not retrieve email from Google' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      console.log('Creating new user from Google profile:', email);
      user = await User.create({
        username: name || email.split('@')[0],
        email,
        googleId: sub,
        role: 'student'
      });
    } else if (!user.googleId) {
      console.log('Updating existing user with Google ID:', email);
      user.googleId = sub;
      await user.save();
    }

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, error: 'Account is suspended. Please contact support.' });
    }

    console.log('Google login successful for:', email);
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('CRITICAL ERROR in googleLogin:', err.stack || err);
    res.status(400).json({
      success: false,
      error: 'Google login failed'
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      twoFactorEnabled: !!user.twoFactorEnabled,
      notificationPreferences: user.notificationPreferences || undefined,
      paymentMethods: user.paymentMethods || []
    }
  });
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update logged-in user profile (name, phone)
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      username,
      phone,
      bio,
      avatar,
      twoFactorEnabled,
      notificationPreferences,
      paymentMethods
    } = req.body;

    const fieldsToUpdate = {};
    if (username && username.trim()) fieldsToUpdate.username = username.trim();
    if (phone !== undefined) {
      const normalizedPhone = String(phone).trim();
      fieldsToUpdate.phone = normalizedPhone || undefined;
    }
    if (bio !== undefined) fieldsToUpdate.bio = String(bio).trim();
    if (avatar !== undefined) fieldsToUpdate.avatar = String(avatar).trim();

    if (typeof twoFactorEnabled === 'boolean') {
      fieldsToUpdate.twoFactorEnabled = twoFactorEnabled;
    }

    if (notificationPreferences && typeof notificationPreferences === 'object') {
      fieldsToUpdate.notificationPreferences = {
        securityAlerts: !!notificationPreferences.securityAlerts,
        courseUpdates: !!notificationPreferences.courseUpdates,
        promoOffers: !!notificationPreferences.promoOffers,
        weeklyNewsletter: !!notificationPreferences.weeklyNewsletter
      };
    }

    if (Array.isArray(paymentMethods)) {
      const normalizedPaymentMethods = paymentMethods
        .map((method) => {
          const last4 = String(method.last4 || '').replace(/\D/g, '').slice(-4);
          const expiryMonth = Number(method.expiryMonth);
          const expiryYear = Number(method.expiryYear);

          if (!last4 || last4.length !== 4) return null;
          if (!Number.isInteger(expiryMonth) || expiryMonth < 1 || expiryMonth > 12) return null;
          if (!Number.isInteger(expiryYear) || expiryYear < 2000) return null;

          const normalized = {
            brand: String(method.brand || 'Card'),
            last4,
            expiryMonth,
            expiryYear,
            holderName: String(method.holderName || '').trim(),
            isDefault: !!method.isDefault,
          };

          if (method._id && mongoose.Types.ObjectId.isValid(method._id)) {
            normalized._id = method._id;
          }

          return normalized;
        })
        .filter(Boolean);

      if (normalizedPaymentMethods.length > 0) {
        const hasExplicitDefault = normalizedPaymentMethods.some((m) => m.isDefault);
        if (!hasExplicitDefault) normalizedPaymentMethods[0].isDefault = true;

        let hasSetDefault = false;
        normalizedPaymentMethods.forEach((m) => {
          if (m.isDefault && !hasSetDefault) {
            hasSetDefault = true;
            return;
          }
          m.isDefault = false;
        });
      }

      fieldsToUpdate.paymentMethods = normalizedPaymentMethods;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update password
// @route   PUT /api/v1/auth/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Please provide currentPassword and newPassword' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user.password) {
      return res.status(400).json({ success: false, error: 'This account uses Google login — password cannot be changed here.' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save(); // triggers the bcrypt pre-save hook

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Keep response generic to avoid revealing whether an account exists.
    if (!user) {
      return res.status(200).json({
        success: true,
        data: 'If an account exists for that email, password reset instructions have been sent.'
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const allowInlineResetToken =
      process.env.NODE_ENV !== 'production' &&
      process.env.ALLOW_RESET_TOKEN_RESPONSE === 'true';

    const payload = {
      success: true,
      data: 'If an account exists for that email, password reset instructions have been sent.'
    };

    if (allowInlineResetToken) {
      payload.resetToken = resetToken;
    }

    return res.status(200).json(payload);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to process forgot password request' });
  }
};

// @desc    Reset Password
// @route   PUT /api/v1/auth/reset-password/:resettoken
// @access  Public
const crypto = require('crypto');
exports.resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ success: false, error: 'Invalid or expired token' });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful'
  });
};

