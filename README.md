# Delivery Management System API

A RESTful API built for managing orders, drivers, routes, and payments for a delivery management system. This project emphasizes robust authentication, authorization, and comprehensive API documentation.

## LIVE LINK :   https://dmsproject-tca1.onrender.com/api-docs/

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation Instructions](#installation-instructions)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [License](#license)
- [Contact Information](#contact-information)

---

## Project Overview

This project provides a delivery management system with the following core functionalities:
1. **User Authentication & Authorization**:
   - Secure JWT-based authentication.
   - Role-based access control for Admin, Driver, and User.
2. **Order Management**:
   - CRUD operations for managing orders.
3. **Driver Management**:
   - CRUD operations for managing drivers.
4. **Route Management**:
   - Manage delivery routes with detailed status tracking.
5. **Payment Calculation**:
   - Calculate driver payments based on completed orders, time spent online, and distance traveled.

The project also includes API documentation, robust error handling, and test cases.

---

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Documentation**: Swagger UI
- **Languages**: ES6

---

## Installation Instructions

### Prerequisites
Ensure the following are installed:
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)

### Steps
1. Clone the repository:
   git clone https://github.com/krishnamidathana/dmsProject.git
   cd dmsProject

 2.Install dependencies:
   npm install

 3.Create an .env file in the root directory with the following:
   PORT=8080
   MONGO_URL=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>

  4.Start the server:
   npm start

 5.Access the application:
   API base URL: http://localhost:8080
   Swagger documentation: http://localhost:8080/api-docs

  # API Documentation
 Access detailed API documentation via Swagger UI at /api-docs.

# Core Endpoints

## User Authentication
- **POST** `/api/auth/login` - Login.
- **POST** `/api/auth/register` - Register a new user.

---

## Order Management
- **POST** `/api/orders` - Create a new order.
- **GET** `/api/orders` - Get all orders.
- **GET** `/api/orders/{id}` - Get an order by ID.
- **PUT** `/api/orders/{id}` - Update an order.
- **DELETE** `/api/orders/{id}` - Delete an order.

---

## Driver Management
- **POST** `/api/drivers` - Create a new driver.
- **GET** `/api/drivers` - Get all drivers.
- **GET** `/api/drivers/{id}` - Get a driver by `driverId`.
- **PUT** `/api/drivers/{id}` - Update a driver by `driverId`.
- **DELETE** `/api/drivers/{id}` - Delete a driver by `driverId`.

---

## Route Management
- **POST** `/api/routes` - Create a new route.
- **GET** `/api/routes` - Get all routes.
- **GET** `/api/routes/{id}` - Get a route by ID.
- **PUT** `/api/routes/{id}` - Update a route by ID.
- **DELETE** `/api/routes/{id}` - Delete a route by ID.
- **POST** `/api/routes/{routeId}/steps` - Add a step to a route.

---

## Payment Calculation
- **GET** `/api/drivers/{driverId}/payment` - Calculate payment details for a driver.


# Project Structure

- **`controllers/`**: Contains logic to process incoming requests and return appropriate responses.
- **`models/`**: Defines data models and their schemas using Mongoose.
- **`routes/`**: Maps HTTP routes to the corresponding controller functions.
- **`middleware/`**: Contains code for request validation, authentication, and other processing steps.
- **`utils/`**: Includes helper functions for common tasks (e.g., formatting data, sending emails).
- **`.env`**: Holds sensitive credentials and configurations like database URL, API keys, etc.
- **`package.json`**: Lists all dependencies, scripts, and metadata about the project.
- **`server.js`**: Initializes and starts the Express server, configures routes, middleware, and database connection.


## License
This project is licensed under the MIT License.

### Contact Information
For questions or support:

Phone: +91 9182190176
Email: krishnakrrish66@gmail.com







