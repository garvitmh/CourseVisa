const Razorpay = require('razorpay');
const crypto = require('crypto');

// @desc    Create Razorpay order
// @route   POST /api/v1/payment/create-order
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    // Convert generic amount parameter to INR paise
    const amountInPaise = Math.round(Number(amount) * 100 * 80); // Quick conversion logic ($1 -> Rs80 approx -> Paise)

    // Using dummy instance if keys are not present yet
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(200).json({
        success: true,
        order: {
          id: "order_" + Math.random().toString(36).substring(7),
          amount: amountInPaise,
          currency: "INR"
        },
        mock: true
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: "receipt_order_" + Math.random().toString(36).substring(7),
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(200).json({ success: true, message: "Mock verification completed" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Optional: Add enrollment logic here after authentic payment
      res.status(200).json({
        success: true,
        message: 'Payment Verified',
        paymentId: razorpay_payment_id
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
