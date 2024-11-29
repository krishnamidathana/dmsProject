import Driver from '../models/Driver.js';
import { updateDriverOnlineTime } from '../utils/driverHelpers.js';

// Create a new driver
export const createDriver = async (req, res) => {
    try {
      const { driverId, name, email, phone, vehicleType, status } = req.body;

       // Validate driverId: Check if it is alphanumeric and between 5 to 10 characters
    const driverIdRegex = /^[a-zA-Z0-9]{5,10}$/;
    if (!driverIdRegex.test(driverId)) {
      return res.status(400).json({ message: 'Invalid driverId. It must be alphanumeric and between 5 to 10 characters long.' });
    }

     // Validate phone number: Check if it contains exactly 10 digits
     const phoneRegex = /^\d{10}$/;
     if (!phoneRegex.test(phone)) {
       return res.status(400).json({ message: 'Invalid phone number. It must be exactly 10 digits long.' });
     }
  

      // Validate status: It must be either 'active' or 'inactive'
    const validStatuses = ['active', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. It must be either "active" or "inactive".' });
    }

      // Check if a driver with the same email or driverId already exists
      const existingDriver = await Driver.findOne({ $or: [{ email }, { driverId }] });
      if (existingDriver) {
        return res.status(400).json({ message: 'Driver with this email or driverId already exists' });
      }

        // Initialize lastActiveAt if the status is active
    const lastActiveAt = status === 'active' ? Date.now() : null;
  
      // Create a new driver with initial values
      const newDriver = new Driver({
        driverId,
        name,
        email,
        phone,
        vehicleType,
        status,
        onlineTime: 0,  // Initialize onlineTime to 0
        lastActiveAt,  // Initialize lastActiveAt as null (will be updated when the driver becomes active)
      });

      
  
      // Save the driver to the database
      await newDriver.save();
  
      res.status(201).json(newDriver);
    } catch (error) {
      res.status(500).json({ message: 'Error creating driver', error });
    }
  };
  
// Get all drivers
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error });
  }
};

// Get a specific driver by driverId
export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findOne({ driverId: req.params.id });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

      //  helper function
      await updateDriverOnlineTime(driver);


    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching driver', error });
  }
};

// Update a driver
export const updateDriver = async (req, res) => {
    try {
      const { name, email, phone, vehicleType, status } = req.body;
  
      // Find the current driver
      const driver = await Driver.findOne({ driverId: req.params.id });
  
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }

           // Validate driverId: Check if it is alphanumeric and between 5 to 10 characters
    const driverIdRegex = /^[a-zA-Z0-9]{5,10}$/;
    if (!driverIdRegex.test(driver.driverId)) {
      return res.status(400).json({ message: 'Invalid driverId. It must be alphanumeric and between 5 to 10 characters long.' });
    }

     // Validate phone number: Check if it contains exactly 10 digits
     const phoneRegex = /^\d{10}$/;
     if (!phoneRegex.test(phone)) {
       return res.status(400).json({ message: 'Invalid phone number. It must be exactly 10 digits long.' });
     }
  

      // Validate status: It must be either 'active' or 'inactive'
    const validStatuses = ['active', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. It must be either "active" or "inactive".' });
    }
  

     
      //  helper function
      await updateDriverOnlineTime(driver);

   

      // Update the driver status and other fields
      driver.status = status;
      driver.name = name;
      driver.email = email;
      driver.phone = phone;
      driver.vehicleType = vehicleType;
  
      // Save the driver to the database
      const updatedDriver = await driver.save();
  
      res.status(200).json(updatedDriver);
    } catch (error) {
      res.status(500).json({ message: 'Error updating driver', error });
    }
  };
  


// Delete a driver
export const deleteDriver = async (req, res) => {
  try {
    const deletedDriver = await Driver.findOneAndDelete({ driverId: req.params.id });

    if (!deletedDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting driver', error });
  }
};

//Driver payment calculation

// Payment Calculation Constants
const PAYMENT_PER_ORDER = 10; // ₹10 per completed order
const PAYMENT_PER_MINUTE = 0.05; // ₹0.05 per minute online
const PAYMENT_PER_KM = 0.20; // ₹0.20 per kilometer traveled

export const calculateDriverPayment = async (req, res) => {
  try {
    const { driverId } = req.params;

    // Find the driver by driverId
    const driver = await Driver.findOne({ driverId });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

      //  helper function
      await updateDriverOnlineTime(driver);
    

    // Calculate payment components
    const ordersPayment = driver.completedOrders * PAYMENT_PER_ORDER;
    const onlineTimePayment = driver.onlineTime * PAYMENT_PER_MINUTE;
    const distancePayment = driver.distanceTraveled * PAYMENT_PER_KM;

    // Total payment
    const totalPayment = ordersPayment + onlineTimePayment + distancePayment;

    // Send the payment details
    res.status(200).json({
      driverId: driver.driverId,
      name: driver.name,
      paymentDetails: {
        ordersPayment,
        onlineTimePayment,
        distancePayment,
        totalPayment,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating payment', error: error.message });
  }
};

