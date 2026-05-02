const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: true,
      enum: ['credit_card', 'bank_transfer', 'cash', 'upi', 'other', 'razorpay'],
    },
    transactionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
