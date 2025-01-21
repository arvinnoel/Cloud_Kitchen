const User = require("../models/user_model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully", data: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Compare provided password with hashed password in the database
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token with user's ID and email
    const token = jwt.sign(
      { userId: userExists._id, email: userExists.email },
      process.env.JWT_SECRET, // Use your secret key from the environment
      { expiresIn: '1h' } // Token expiry time, e.g., 1 hour
    );

    // Store the token in the user's record in the database
    userExists.token = token;
    await userExists.save();

    // Send success response with the token
    res.status(200).json({
      message: "Login successful",
      data: {
        user: userExists, // Return user data (excluding sensitive information like password)
        token, // Include the JWT token
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the product details from the Product model
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Extract necessary product details
    const { imageFile, price, kitchenName, name } = product;

    // Check if product exists in the cart
    const productInCart = user.tasks.cart.find((item) => item.productId.toString() === productId);

    if (productInCart) {
      // Update the quantity of the product in the cart
      productInCart.quantity += quantity;
    } else {
      // Add new product to the cart with additional product info
      user.tasks.cart.push({
        productId,
        quantity,
        status: "pending",
        imageFile,       // Store the product image
        price,           // Store the price
        kitchenName,     // Store the kitchen name
        name,            // Store the product name
      });
    }

    await user.save();
    res.status(200).json({ message: "Product added to cart", cart: user.tasks.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeItemFromCart = async (req, res) => {
  const { productId } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the product from the cart
    user.tasks.cart = user.tasks.cart.filter((item) => item.productId !== productId);

    await user.save();
    res.status(200).json({ message: "Product removed from cart", cart: user.tasks.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  removeItemFromCart,
  addItemToCart
};
