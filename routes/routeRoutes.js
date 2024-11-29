import express from 'express';
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  addStepToRoute,
} from '../controllers/routeController.js';

import { protect, authorize } from '../middleware/authMiddleware.js'; // Import the middleware

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Route management
 */

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Create a new route
 *     description: This endpoint allows an admin or driver to create a new route. 
 *     tags: [Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeId
 *               - orderId
 *               - driverId
 *               - steps
 *               - status
 *             properties:
 *               routeId:
 *                 type: string
 *               orderId:
 *                 type: string
 *               driverId:
 *                 type: string
 *                 description: ID of the driver assigned to the route
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     location:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Bad request
 */

router.post('/', protect, authorize('admin', 'driver'), createRoute);

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Get all routes
 *     description: This endpoint only allows an admin to get all routes.
 *     tags: [Routes]
 *     responses:
 *       200:
 *         description: A list of routes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   routeId:
 *                     type: string
 *                   orderId:
 *                     type: string
 *                   driverId:
 *                     type: string
 *                   steps:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         location:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                   status:
 *                     type: string
 *                     enum: [pending, in-progress, completed]
 */
router.get('/', protect, authorize('admin'), getAllRoutes);

/**
 * @swagger
 * /api/routes/{id}:
 *   get:
 *     summary: Get a route by ID
 *     description: This endpoint allows an admin or driver to get route by id.
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The route ID
 *     responses:
 *       200:
 *         description: The route details
 *       404:
 *         description: Route not found
 */
router.get('/:id', protect, authorize('admin','driver'), getRouteById);

/**
 * @swagger
 * /api/routes/{id}:
 *   put:
 *     summary: Update a route by ID
 *     description: This endpoint allows an admin or driver to update route.
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The route ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeId
 *               - orderId
 *               - driverId
 *               - steps
 *               - status
 *             properties:
 *               routeId:
 *                 type: string
 *                 description: Unique identifier for the route
 *               orderId:
 *                 type: string
 *                 description: Associated order ID
 *               driverId:
 *                 type: string
 *                 description: ID of the driver assigned to the route
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     location:
 *                       type: string
 *                       description: Location details of the step
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of the step
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 description: Current status of the route
 *     responses:
 *       200:
 *         description: Route updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Route updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Route not found
 */

router.put('/:id', protect, authorize('admin', 'driver'), updateRoute);

/**
 * @swagger
 * /api/routes/{id}:
 *   delete:
 *     summary: Delete a route by ID
 *     description: This endpoint allows only an admin to delete a route.
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The route ID
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *       404:
 *         description: Route not found
 */
router.delete('/:id', protect, authorize('admin'), deleteRoute);

/**
 * @swagger
 * /api/routes/{routeId}/steps:
 *   post:
 *     summary: Add a step to a route
 *     description: This endpoint allows an admin or driver to add steps to the route.
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The route ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - timestamp
 *             properties:
 *               location:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Step added successfully
 *       404:
 *         description: Route not found
 */
router.post('/:routeId/steps', protect, authorize('admin', 'driver'), addStepToRoute);

export default router;
