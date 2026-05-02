const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    personName: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    agreedAmount: {
      type: Number,
      default: 0,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number, // Percentage 0-100
      default: 0,
    },
    startDate: {
      type: Date,
    },
    expectedCompletionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'planning', 'in_progress', 'completed', 'on_hold', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Update remaining amount automatically when amountPaid or totalCost changes
projectSchema.pre('save', async function () {
  if (this.isModified('amountPaid') || this.isModified('totalCost') || this.isModified('agreedAmount')) {
    const cost = this.totalCost || this.agreedAmount || 0;
    this.remainingAmount = cost - (this.amountPaid || 0);
  }
});

module.exports = mongoose.model('Project', projectSchema);
