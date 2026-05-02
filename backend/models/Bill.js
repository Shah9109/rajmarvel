const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    pdfUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// Calculate total amount before saving if not provided
billSchema.pre('save', async function () {
  if (this.isModified('items') && !this.totalAmount) {
    this.totalAmount = this.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
  }
});

module.exports = mongoose.model('Bill', billSchema);
