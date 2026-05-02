const Payment = require('../models/Payment');
const Project = require('../models/Project');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id') {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return null;
};

// @desc    Create a payment (Manual Request Approval)
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
  try {
    const { projectId, amount, method, transactionId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to make payment for this project' });
    }

    const payment = await Payment.create({
      projectId,
      amount,
      method,
      transactionId,
      status: 'pending'
    });

    // Notify user
    await sendEmail({
      email: req.user.email,
      subject: 'Payment Submitted - Raj Marvel Exterior Designs',
      message: `Dear ${req.user.name},\n\nYour payment of $${amount} for project "${project.title}" has been submitted and is pending admin verification. Please ensure you have sent the screenshot to our WhatsApp (8700595896).\n\nThank you.`,
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/razorpay/order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, projectId } = req.body;
    const razorpay = getRazorpayInstance();
    
    if (!razorpay) {
      return res.status(500).json({ message: 'Razorpay is not configured' });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise/cents)
      currency: "INR",
      receipt: projectId,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, projectId, amount } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is successful
      const payment = await Payment.create({
        projectId,
        amount,
        method: 'razorpay',
        transactionId: razorpay_payment_id,
        status: 'completed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });

      const project = await Project.findById(projectId);
      if (project) {
        project.amountPaid += Number(amount);
        await project.save();
      }

      await sendEmail({
        email: req.user.email,
        subject: 'Payment Successful - Raj Marvel Exterior Designs',
        message: `Dear ${req.user.name},\n\nYour payment of $${amount} for project "${project.title}" was successful.\n\nThank you.`,
      });

      res.status(200).json({ message: 'Payment verified successfully', payment });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payments for a project
// @route   GET /api/payments/:projectId
// @access  Private
const getProjectPayments = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify user owns the project or is admin
    if (project.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these payments' });
    }

    const payments = await Payment.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).populate('projectId', 'title userId').sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update payment status (Admin)
// @route   PUT /api/payments/:id/status
// @access  Private/Admin
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id).populate('projectId');

    if (payment) {
      payment.status = status;
      const updatedPayment = await payment.save();

      // If payment is completed, update the project's amountPaid
      if (status === 'completed') {
        const project = payment.projectId;
        if (project) {
          project.amountPaid += payment.amount;
          await project.save();

          // Notify User
          const user = await User.findById(project.userId);
          if (user) {
            await sendEmail({
              email: user.email,
              subject: 'Payment Confirmed - Raj Marvel Exterior Designs',
              message: `Dear ${user.name},\n\nYour payment of $${payment.amount} for project "${project.title}" has been verified and confirmed by our team.\n\nThank you.`,
            });
          }
        }
      }

      res.json(updatedPayment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, createRazorpayOrder, verifyRazorpayPayment, getProjectPayments, getAllPayments, updatePaymentStatus };
