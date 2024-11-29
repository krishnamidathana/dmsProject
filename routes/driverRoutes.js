import express from 'express';
import {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  calculateDriverPayment,
} from '../controllers/driverController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/drivers:
 *   post:
 *     summary: Create a new driver
 *     description: This endpoint allows only a driver to create driver profile.
 *     tags:
 *       - Drivers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverId
 *               - name
 *               - email
 *               - phone
 *               - vehicleType
 *               - status
 *             properties:
 *               driverId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               vehicleType:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [inactive ,active]
 *     responses:
 *       201:
 *         description: Driver created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', protect, authorize('driver'), createDriver);

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Get all drivers
 *     description: This endpoint allows only an admin to get all drivers data.
 *     tags:
 *       - Drivers
 *     responses:
 *       200:
 *         description: A list of all drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   driverId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   vehicleType:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [inactive ,active]
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, authorize('admin'), getAllDrivers);

/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Get a driver by driverId
 *     description: This endpoint allows only an admin to get driver details by driverId.
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The driverId of the driver to retrieve
 *     responses:
 *       200:
 *         description: Driver found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 driverId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 vehicleType:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [inactive ,active]
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', protect, authorize('admin'), getDriverById);

/**
 * @swagger
 * /api/drivers/{id}:
 *   put:
 *     summary: Update a driver by driverId
 *     description: This endpoint allows only a driver to update driver details.
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The driverId of the driver to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               vehicleType:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [inactive, active]
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', protect, authorize('driver'), updateDriver);

/**
 * @swagger
 * /api/drivers/{id}:
 *   delete:
 *     summary: Delete a driver by driverId
 *     description: This endpoint only allows an admin to delete driver.
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The driverId of the driver to delete
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', protect, authorize('admin'), deleteDriver);

/**
 * @swagger
 * /api/drivers/{driverId}/payment:
 *   get:
 *     summary: Calculate payment details for a driver
 *     description: This endpoint allows an admin or driver to calculate driver payments based on the number of completed orders, time spent online, and distance traveled.
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the driver
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 driverId:
 *                   type: string
 *                   description: The unique identifier of the driver
 *                 name:
 *                   type: string
 *                   description: The name of the driver
 *                 paymentDetails:
 *                   type: object
 *                   properties:
 *                     ordersPayment:
 *                       type: number
 *                       description: Payment based on the number of completed orders
 *                     onlineTimePayment:
 *                       type: number
 *                       description: Payment based on time spent online (in minutes)
 *                     distancePayment:
 *                       type: number
 *                       description: Payment based on distance traveled (in kilometers)
 *                     totalPayment:
 *                       type: number
 *                       description: Total payment combining all factors
 *       400:
 *         description: Invalid input or missing driverId
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
router.get('/:driverId/payment', protect, authorize('admin','driver'), calculateDriverPayment);

export default router;
