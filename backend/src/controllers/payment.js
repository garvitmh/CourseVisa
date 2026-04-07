const Razorpay = require('razorpay');
const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');

const PAYMENT_MODES = {
  SIMULATE: 'simulate',
  RAZORPAY: 'razorpay',
};

const getPaymentMode = () => {
  const configured = (process.env.PAYMENT_MODE || PAYMENT_MODES.SIMULATE).toLowerCase();
  return configured === PAYMENT_MODES.RAZORPAY ? PAYMENT_MODES.RAZORPAY : PAYMENT_MODES.SIMULATE;
};

const resolveCourseId = (item) => {
  if (!item) return '';
  return String(item.courseId || item.id || item.course?._id || item.course?.id || '');
};

const enrollCoursesForUser = async (userId, items = []) => {
  let enrolledCount = 0;

  for (const item of items) {
    const courseId = resolveCourseId(item);
    if (!courseId) continue;

    const existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (existing) continue;

    await Enrollment.create({
      user: userId,
      course: courseId,
      progress: 0
    });
    enrolledCount += 1;
  }

  return enrolledCount;
};

// @desc    Create Razorpay order
// @route   POST /api/v1/payment/create-order
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const paymentMode = getPaymentMode();
    if (paymentMode !== PAYMENT_MODES.RAZORPAY) {
      return res.status(409).json({
        success: false,
        error: 'Razorpay order creation is disabled while PAYMENT_MODE=simulate'
      });
    }

    const { amount } = req.body;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number'
      });
    }

    // Backend expects amount in INR, Razorpay expects paise.
    const amountInPaise = Math.round(numericAmount * 100);

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Razorpay configuration missing on server'
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: "receipt_order_" + Math.random().toString(36).substring(7),
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      mode: paymentMode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Payment Order Failed'
    });
  }
};

// @desc    Verify Razorpay payment status
// @route   POST /api/v1/payment/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const paymentMode = getPaymentMode();
    if (paymentMode !== PAYMENT_MODES.RAZORPAY) {
      return res.status(409).json({
        success: false,
        error: 'Razorpay verification is disabled while PAYMENT_MODE=simulate'
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, error: 'Razorpay configuration missing on server' });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing Razorpay verification fields'
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const enrolledCount = await enrollCoursesForUser(req.user.id, items);

      res.status(200).json({
        success: true,
        message: 'Payment Verified',
        paymentId: razorpay_payment_id,
        enrolledCount,
        mode: paymentMode
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid Signature'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Payment Verification Failed'
    });
  }
};

// @desc    Simulate payment and enroll user
// @route   POST /api/v1/payment/simulate
// @access  Private
exports.simulatePayment = async (req, res, next) => {
  try {
    const paymentMode = getPaymentMode();
    if (paymentMode !== PAYMENT_MODES.SIMULATE) {
      return res.status(409).json({
        success: false,
        error: 'Payment simulation is disabled while PAYMENT_MODE=razorpay'
      });
    }

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in cart' });
    }

    const enrolledCount = await enrollCoursesForUser(req.user.id, items);

    // Simulate network delay for realism
    setTimeout(() => {
      res.status(200).json({
        success: true,
        message: 'Mock payment successful and courses enrolled!',
        enrolledCount,
        mode: paymentMode
      });
    }, 1500);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Payment Simulation Failed'
    });
  }
};
