# Backend User Management System (Node.js, Express, MongoDB)

 Overview
  A robust backend system for user registration, authentication, role-based access, file uploads, email notifications, soft deletion, and more. Built with Node.js, Express, and MongoDB (Mongoose ORM).



 Tech Stack & Dependencies
  - Node.js (JavaScript runtime)
  - Express (Web framework)
  - MongoDB (Database)
  - Mongoose (MongoDB ORM)
  - JWT (Authentication)
  - Multer (File uploads)
  - Nodemailer (Email sending)
  - bcryptjs (Password hashing)
  - dotenv (Environment variables)
  - Morgan/Winston (Logging)


 Project Structure

  Server/
    app.js
    controllers/
      authController.js
      userControllers.js
    dbconfig/
      dbconnectivity.js
    logs/
      app.log
    middlewares/
      authMiddleware.js
      checkRole.js
      errorHandler.js
      uploadMiddleware.js
    models/
      counterModels.js
      userModels.js
    routes/
      userRoutes.js
    seedAdmin.js
    utils/
      autoIncrement.js
      errorHelper.js
      hashPassword.js
      logger.js
      mailHelper.js




 Environment Setup
  Create a `.env` file in the root with the following variables:

    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=1d
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password




 Database Models
  User Model (`models/userModels.js`)
  - Fields: `userId`, `customId`, `firstName`, `lastName`, `email`, `age`, `address`, `phone`, `password`, `role` (`user|admin|moderator`), `profileImage`, `isDeleted`, `deletedAt`, timestamps.
  - Validations: required fields, unique email/phone, regex for email/phone, min/max for age, password min length.
  - Soft delete: `isDeleted` flag and `deletedAt` timestamp.

 Counter Model (`models/counterModels.js`)
  - For auto-incrementing user IDs.



 API Endpoints
  All endpoints are defined in `routes/userRoutes.js` and handled by `controllers/userControllers.js` and `controllers/authController.js`.

 Auth
- POST `/login`
  - Login with email and password. Returns JWT token.
  - Example:
    -http
    POST /login
    Content-Type: application/json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    

- POST `/register`
  - Register a new user with profile image upload. Sends welcome email.
  - Example (multipart/form-data):
    -http
    POST /register
    Content-Type: multipart/form-data
    Body: firstName, lastName, email, age, address, phone, password, profileImage (file)
    

 User Management
- GET `/getallusers` (Admin only)
  - List all users with pagination, sorting, filtering.
  - Query params: `page`, `limit`, `sortBy`, `order`, `role`, `age`, `firstName`
  - Example:
    -http
    GET /getallusers?limit=5&page=2&sortBy=firstName&order=asc&role=admin
    Authorization: Bearer <token>
    

  - GET `/users/:id`
    - Get user by ID.

  - PUT `/users/:id`
    - Update user details.

  - DELETE `/users/:id`
    - Soft delete a user (sets `isDeleted: true`).

  - GET `/getDeletedUsers` (Admin only)
    - List all soft-deleted users.

  - POST `/restoreUser/:id` (Admin only)
    - Restore a soft-deleted user.

 File Upload
  - Profile image upload is handled during registration via Multer middleware (`middlewares/uploadMiddleware.js`). Only image files (jpeg, jpg, png, gif) up to 2MB are allowed.



 Authentication & Authorization
  - JWT-based authentication: All protected routes require a valid JWT in the `Authorization` header.
  - Role-based access: Use `middlewares/checkRole.js` to restrict routes to specific roles (e.g., admin).
  - Auth middleware: `middlewares/authMiddleware.js` verifies JWT and attaches user info to `req.user`.



 Middlewares
  - authMiddleware.js: Verifies JWT token.
  - checkRole.js: Restricts access based on user role.
  - errorHandler.js: Centralized error handling for all routes.
  - uploadMiddleware.js: Handles file uploads and validates file type/size.



 Utilities
  - hashPassword.js: Hashes passwords using bcrypt.
  - mailHelper.js: Sends emails using Nodemailer.
  - autoIncrement.js: Generates auto-incremented user IDs.
  - logger.js: Logs events to a file.
  - errorHelper.js: Custom error creation.



 Features
  - User registration with image upload and welcome email.
  - Login with JWT authentication.
  - Role-based access control (admin, user, moderator).
  - Soft delete and restore users.
  - Logging of important events (registration, errors, etc.).
  - Email notifications on registration.
  - Pagination, sorting, and filtering for user listing.
  - Admin-only routes for sensitive operations.
  - File upload restrictions (type, size).



 Reference: Complex Internal Logic
  - Auto-increment user IDs: See `utils/autoIncrement.js` and `models/counterModels.js`.
  - Password hashing: See `utils/hashPassword.js`.
  - Email sending: See `utils/mailHelper.js`.
  - Logging: See `utils/logger.js`.
  - Error handling: See `middlewares/errorHandler.js`.
  - Role-based access: See `middlewares/checkRole.js`.
  - File upload: See `middlewares/uploadMiddleware.js`.



 Testing & API Documentation
  - (Optional) Integrate Swagger (`swagger-ui-express`) for API docs.
  - (Optional) Use Jest/Supertest for endpoint testing.



 Advanced Ideas (Not implemented by default)
  - Scheduled jobs with node-cron
  - Real-time events with Socket.io
  - Webhooks & external APIs
  - PDF report generation
  - Cloud uploads (Cloudinary/S3)
  - Dockerization



 Getting Started
  1. Clone the repo and install dependencies:
    -bash
    npm install
    
  2. Set up your `.env` file.
  3. Start MongoDB locally or use MongoDB Atlas.
  4. Run the server:
    -bash
    npm start
   

## Author

**Himal Pandey**

**Portfolio:** himalpandey.vercel.app

**GitHub:** github.com/pandeyhimal

**LinkedIn:** https://www.linkedin.com/in/himal-pandey-297988225/

