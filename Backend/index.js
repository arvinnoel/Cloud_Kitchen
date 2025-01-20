require('dotenv').config();
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const RunServer = require('./database/connection');
const signupRouter = require('./routes/user_routes');
const OwnersignupRouter = require('./routes/owner_routes');
const AdminRouter = require('./routes/admin_routes');
const productRouter = require('./routes/owner_additem_routes');
const authenticateOwner = require('./middleware/authMiddleware');
const userAuthMiddleware = require('./middleware/userAuthMiddleware');

const app = express();
const port = process.env.PORT || 5000;

// Initialize Database Connection
RunServer();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure CORS
const allowedOrigins = [
  'https://cloud-kitchen-4a71.onrender.com',
  'http://localhost:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS Error: Blocked origin', origin); // Log the origin causing issues
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

// Routes
app.use('/user', signupRouter); // User signup and related routes
app.use('/owner', OwnersignupRouter); // Owner signup and related routes
app.use('/admin', AdminRouter); // Admin routes

// Authenticated Routes
app.use('/owner', authenticateOwner, productRouter); // Owner product routes
app.use('/user', userAuthMiddleware, productRouter); // User product-related routes

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
