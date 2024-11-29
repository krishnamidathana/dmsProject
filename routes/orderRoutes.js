import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';

import { protect, authorize } from '../middleware/authMiddleware.js'; // Import the middleware

const router = express.Router();

// Create a new order
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: This endpoint allows an admin or user to create an order.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               deliveryAddress:
 *                 type: string
 *               orderStatus:
 *                 type: string
 *                 enum: [pending, dispatched, delivered, canceled]
 *               totalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/orders', protect, authorize('admin', 'user'), createOrder);

// Get all orders
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: This endpoint allows an admin or driver to get all orders.
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the order
 *                   customerName:
 *                     type: string
 *                     description: The name of the customer
 *                   deliveryAddress:
 *                     type: string
 *                     description: The address where the order should be delivered
 *                   orderStatus:
 *                     type: string
 *                     enum:
 *                       - pending
 *                       - dispatched
 *                       - delivered
 *                       - canceled
 *                     description: The current status of the order
 *                   totalAmount:
 *                     type: number
 *                     description: The total amount for the order
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the order was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the order was last updated
 *       500:
 *         description: Internal server error
 */
router.get('/orders', protect, authorize('admin', 'driver'), getAllOrders);

// Get order by ID
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: This endpoint allows an admin or driver to get an order by id.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 customerName:
 *                   type: string
 *                 deliveryAddress:
 *                   type: string
 *                 orderStatus:
 *                   type: string
 *                   enum:
 *                     - pending
 *                     - dispatched
 *                     - delivered
 *                     - canceled
 *                 totalAmount:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Order not found
 */
router.get('/orders/:id', protect, authorize('admin', 'driver'), getOrderById);

// Update an order
/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order
 *     description: This endpoint allows an admin or driver to update an order.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               deliveryAddress:
 *                 type: string
 *               orderStatus:
 *                 type: string
 *                 enum: [pending, dispatched, delivered, canceled]
 *               totalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 customerName:
 *                   type: string
 *                 deliveryAddress:
 *                   type: string
 *                 orderStatus:
 *                   type: string
 *                   enum:
 *                     - pending
 *                     - dispatched
 *                     - delivered
 *                     - canceled
 *                 totalAmount:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put('/orders/:id', protect, authorize('admin','driver'), updateOrder);

// Delete an order
/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     description: This endpoint allows only an admin to delete an order.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete('/orders/:id', protect, authorize('admin'), deleteOrder);

export default router;
