import mongoose from 'mongoose';

// schema for a driver
const driverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email'], // Email format validation
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please enter a valid phone number'], // Phone number validation (10 digits)
    },
    vehicleType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive', 
    },
    completedOrders: {
        type: Number,
        default: 0,  
      },
      onlineTime: {
        type: Number,  
        default: 0,    
      },
      lastActiveAt: {
        type: Date,  // Store timestamp of when the driver was last active
      },
      distanceTraveled: {
        type: Number, // Store total distance traveled in kilometers
        default: 23,
      },
  },
  { timestamps: true } 
);

// Create and export the model
const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
