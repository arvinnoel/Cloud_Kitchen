const jwt = require('jsonwebtoken');
const User = require('../models/user_model'); // Assuming the User model is correctly imported

const userAuthMiddleware = async (req, res, next) => {
  try {
    // Bypass authentication for the getAllProducts route
    if (req.path === '/api/getallproducts') {
      return next(); // Skip authentication
    }

    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user using the decoded userId
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user data to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else {
      console.error('Error in userAuthMiddleware:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = userAuthMiddleware;
