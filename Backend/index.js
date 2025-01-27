require('dotenv').config();
const express = require('express');
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

RunServer();

app.use(express.json());
app.use(bodyParser.json());

const allowedOrigins = [
  'https://cloud-kitchen-8nrj.onrender.com',
  'http://localhost:5173',
  'https://web.postman.co'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS Error: Blocked origin', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

// Routes
app.use('/user', signupRouter); 
app.use('/owner', OwnersignupRouter); 
app.use('/admin', AdminRouter); 

// Authenticated Routes
app.use('/owner', authenticateOwner, productRouter); 
app.use('/user', userAuthMiddleware, productRouter); 

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
