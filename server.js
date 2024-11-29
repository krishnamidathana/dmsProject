import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import colors from 'colors'

import authRoutes from './routes/authRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import routeRoutes from './routes/routeRoutes.js';

// Load environment variables
dotenv.config();

// Check if MONGO_URI is set in the environment variables
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI not defined in .env');
  process.exit(1); // Exit if MONGO_URI is missing
}

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'.bgYellow.black))
  .catch(err => console.log('MongoDB connection error:', err .bgRed.black));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delivery Management System API',
      version: '1.0.0',
      description: 'API Documentation for the Delivery Management System',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to route files
};


const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define routes
app.use('/api/auth', authRoutes);

//orders
app.use('/api', orderRoutes);

// Use the driver routes
app.use('/api/drivers', driverRoutes);

//  route - (steps)
app.use('/api/routes', routeRoutes);

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Define port and start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgGreen.black);
});
