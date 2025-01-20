const jwt = require('jsonwebtoken');
const Owner = require('../models/owner_model');

const authMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the owner using the decoded email or ownerId
    const owner = await Owner.findOne({ _id: decoded.ownerId });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Attach the owner data to the request object
    req.owner = owner;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else {
      console.error("Error in authMiddleware:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

module.exports = authMiddleware;
