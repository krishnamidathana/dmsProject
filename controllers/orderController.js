import Order from '../models/Order.js';

// Create a new order
export const createOrder = async (req, res) => {
    console.log(req.user)
  try {
    const { customerName, deliveryAddress, orderStatus, totalAmount } = req.body;

     // Validate customerName: It should be a non-empty string
     if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
        return res.status(400).json({ message: 'Invalid customerName. It must be a non-empty string.' });
      }
  
      // Validate deliveryAddress: It should be a non-empty string
      if (!deliveryAddress || typeof deliveryAddress !== 'string' || deliveryAddress.trim() === '') {
        return res.status(400).json({ message: 'Invalid deliveryAddress. It must be a non-empty string.' });
      }
  
      // Validate orderStatus: It must be one of the valid statuses
      const validStatuses = ['pending','dispatched','delivered','canceled'];
      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({ message: 'Invalid orderStatus. It must be one of "pending", "shipped", or "delivered".' });
      }
  
      // Validate totalAmount: It must be a positive number
      if (typeof totalAmount !== 'number' || totalAmount <= 0) {
        return res.status(400).json({ message: 'Invalid totalAmount. It must be a positive number.' });
      }

    // Create new order
    const newOrder = new Order({
      customerName,
      deliveryAddress,
      orderStatus,
      totalAmount,
    });

    // Save the order to the database
    const order = await newOrder.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get a specific order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id});

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
    try {

        const { customerName, deliveryAddress, orderStatus, totalAmount } = req.body;

   // Validate customerName: It should be a non-empty string
   if (customerName && (typeof customerName !== 'string' || customerName.trim() === '')) {
    return res.status(400).json({ message: 'Invalid customerName. It must be a non-empty string.' });
  }

  // Validate deliveryAddress: It should be a non-empty string
  if (deliveryAddress && (typeof deliveryAddress !== 'string' || deliveryAddress.trim() === '')) {
    return res.status(400).json({ message: 'Invalid deliveryAddress. It must be a non-empty string.' });
  }

  // Validate orderStatus: It must be one of the valid statuses
  const validStatuses = ['pending', 'dispatched', 'delivered', 'canceled'];
  if (orderStatus && !validStatuses.includes(orderStatus)) {
    return res.status(400).json({ message: 'Invalid orderStatus. It must be one of "pending", "dispatched", "delivered", or "canceled".' });
  }

  // Validate totalAmount: It must be a positive number
  if (totalAmount && (typeof totalAmount !== 'number' || totalAmount <= 0)) {
    return res.status(400).json({ message: 'Invalid totalAmount. It must be a positive number.' });
  }

      // Use findOneAndUpdate to correctly update the document
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: req.params.id }, // Find by orderId
        { 
          ...req.body,              // Fields to update
          updatedAt: Date.now()      // Set updatedAt to the current time
        },
        { 
          new: true,                // Return the updated document
          runValidators: true       // Validate before updating
        }
      );
  
      // Check if the order was found and updated
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json(updatedOrder); // Return the updated order
    } catch (error) {
      res.status(500).json({ message: 'Error updating order', error });
    }
  };
  

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findOneAndDelete({ orderId: req.params.id});
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};
