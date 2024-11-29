import mongoose from 'mongoose';

// Define the schema for a route
const routeSchema = new mongoose.Schema(
  {
    routeId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    driverId: {
        type: String, 
        required: true, // Optional: Set to true if every route must have an associated driver
      },
    steps: [
      {
        location: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'], // Restrict status to these values
      default: 'pending', // Default status is pending
    },
  },
  { timestamps: true } // Automatically handle createdAt and updatedAt
);

// Create and export the model
const Route = mongoose.model('Route', routeSchema);

export default Route;
