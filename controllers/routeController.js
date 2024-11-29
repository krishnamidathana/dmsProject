import Route from '../models/routeModel.js';
import Driver from '../models/Driver.js';
import Order from '../models/Order.js';


// Create a new route
export const createRoute = async (req, res) => {
    try {
      const { routeId, orderId, driverId, steps, status } = req.body;
  
      // Validate required fields
      if (!routeId || !orderId || !driverId || !steps || !status) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Validate the order
      const order = await Order.findOne({ orderId });
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Validate the driver
      const existingDriver = await Driver.findOne({ driverId });
      if (!existingDriver) {
        return res.status(404).json({ message: 'Driver not found' });
      }

     // Check if the driver already has an active/in-progress route
    //  const activeRoute = await Route.findOne({ driverId, status: { $in: ['pending', 'in-progress'] } });
    //  if (activeRoute) {
    //    return res.status(400).json({ message: 'Driver already has an active or in-progress route assigned' });
    //  }

  // Check if the orderId is already associated with a route
  const existingOrderRoute = await Route.findOne({ orderId });
  if (existingOrderRoute) {
    return res.status(400).json({ message: `Order ${orderId} is already assigned to a Driver` });
  }
  
      // Validate driver status
      if (existingDriver.status !== 'active') {
        return res.status(400).json({ message: 'Driver must be active to create a route' });
      }

      const checkRoute = await Route.findOne({ routeId });
      if (checkRoute) {
        return res.status(400).json({ message: 'this routeId already exists' });
      }


      const existingRoute = await Route.findOne({ driverId });
      if (existingRoute) {
        return res.status(400).json({ message: 'Driver already has a route assigned' });
      }
  
      // Validate status
      const validStatuses = ['pending', 'in-progress'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid routeStatus. It must be one of "pending", "in-progress".'  });
      }
  
      // Ensure 'completed' status is not allowed at creation
      if (status === 'completed') {
        return res
          .status(400)
          .json({ message: 'You cannot set the status to completed while creating a route' });
      }
  
      // Update order status if the route status is 'in-progress'
    if (status === 'in-progress') {
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        { orderStatus: 'dispatched' },  // Set the order status to 'dispatched'
        { new: true }
      );
      console.log(`orderId: ${orderId}, updated orderStatus: ${updatedOrder.orderStatus}`);
    }
      // Create a new route instance
      const route = new Route({
        routeId,
        orderId,
        driverId,
        steps,
        status,
      });
  
      // Save the route
      const savedRoute = await route.save();
  
      res.status(201).json(savedRoute);
    } catch (error) {
      res.status(500).json({ message: 'Error creating route', error: error.message });
    }
  };
  

// Get all routes
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a route by ID
export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findOne({ routeId: req.params.id });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/////   route update //////
export const updateRoute = async (req, res) => {
    try {
      const { routeId, orderId, driverId, steps, status } = req.body;
  
      // Validate required fields
      if (!routeId || !orderId || !driverId || !steps || !status) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Validate status
      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid routeStatus. It must be one of "pending", "in-progress", "completed".' });
      }     
  
      // Check if the driver exists
      const existingDriver = await Driver.findOne({ driverId });
      if (!existingDriver) {
        return res.status(404).json({ message: 'Driver not found' });
      }

       // Check if the driver active
      if (existingDriver.status !== 'active') {
        return res.status(400).json({ message: 'Driver must be active to update the route' });
      }
  
      // Find the current route
      const existingRoute = await Route.findOne({ routeId: req.params.id });
      if (!existingRoute) {
        return res.status(404).json({ message: 'Route not found' });
      }

          // Update order status if the route status is 'in-progress'
    if (status === 'in-progress') {
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        { orderStatus: 'dispatched' },  // Set the order status to 'dispatched'
        { new: true }
      );
    }
  
      // Handle status change to 'completed'
      if (status === 'completed' && existingRoute.status !== 'completed') {
        // Increment completedOrders for the driver
        await Driver.findOneAndUpdate(
          { driverId },
          { $inc: { completedOrders: 1 } } // Increment completedOrders by 1
        );
  
        // Update the order status to 'delivered'
        await Order.findOneAndUpdate(
          { orderId },
          { orderStatus: 'delivered' },
          { new: true }
        );
      }
  
      // Update the route with new data
      const updatedRoute = await Route.findOneAndUpdate(
        { routeId: req.params.id },
        { routeId, orderId, driverId, steps, status },
        { new: true }
      );
  
      if (!updatedRoute) {
        return res.status(404).json({ message: 'Route not found' });
      }
  
      res.status(200).json(updatedRoute);
    } catch (error) {
      res.status(500).json({ message: 'Error updating route', error: error.message });
    }
  };
  


// Delete a route by ID
export const deleteRoute = async (req, res) => {
  try {
    const deletedRoute = await Route.findOneAndDelete({ routeId: req.params.id });
    if (!deletedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStepToRoute = async (req, res) => {
    try {
      const { routeId } = req.params; // Route ID from the URL
      const { location, timestamp } = req.body; // New step data
  
      const updatedRoute = await Route.findOneAndUpdate(
        { routeId }, // Find the route by its routeId
        { $push: { steps: { location, timestamp } } }, // Push the new step to the steps array
        { new: true } // Return the updated document
      );
  
      if (!updatedRoute) {
        return res.status(404).json({ message: 'Route not found' });
      }
  
      res.status(200).json(updatedRoute);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
