const express = require('express');
const router = express.Router();
const { createPayment, createRazorpayOrder, verifyRazorpayPayment, getProjectPayments, getAllPayments, updatePaymentStatus } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createPayment).get(protect, admin, getAllPayments);
router.route('/razorpay/order').post(protect, createRazorpayOrder);
router.route('/razorpay/verify').post(protect, verifyRazorpayPayment);
router.route('/:projectId').get(protect, getProjectPayments);
router.route('/:id/status').put(protect, admin, updatePaymentStatus);

module.exports = router;
