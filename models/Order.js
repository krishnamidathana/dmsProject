import mongoose from 'mongoose';

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => Math.random().toString(36).substr(2, 6), // Generate 5-6 character alphanumeric code
    },
    customerName: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'dispatched', 'delivered', 'canceled'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create Order Model
const Order = mongoose.model('Order', orderSchema);

export default Order;
