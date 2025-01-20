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
// const userfetchproductRouter = require('./routes/owner_additem_routes');
const authenticateOwner = require('./middleware/authMiddleware');
const userAuthMiddleware = require('./middleware/userAuthMiddleware');
const app = express();
const port = process.env.PORT || 3000;

RunServer();
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const allowedOrigins = [
  'https://cloud-kitchen-4a71.onrender.com', 
  'http://localhost:5173', 
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS Error:', origin); // Log the origin causing issues
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
// Routes
app.use('/user', signupRouter);
app.use('/owner', OwnersignupRouter);
app.use('/admin', AdminRouter);
// app.use('/api',loginOwner)
app.use('/owner', authenticateOwner, productRouter);
app.use('/user',userAuthMiddleware, productRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
