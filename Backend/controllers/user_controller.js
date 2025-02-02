const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Product = require("../models/owner_additem_model");
const mongoose = require("mongoose");
const Owner = require("../models/owner_model");

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
      message: "User registered successfully",
      data: newUser,
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
      { expiresIn: "1h" } // Token expiry time, e.g., 1 hour
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
  const { productId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the product details from the Product model
    const product = await Product.findById(productId); // Ensure Product model is correctly imported

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { imageFile, price, kitchenName, name } = product;

    // Check if product exists in the cart
    const productInCart = user.tasks.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!productInCart) {
      // Add new product to the cart with quantity set to 1
      user.tasks.cart.push({
        productId,
        quantity: 1,
        status: "pending",
        imageFile,
        price,
        kitchenName,
        name,
      });
    } else {
      return res
        .status(400)
        .json({
          message:
            "Product is already in the cart. Only one quantity is allowed.",
        });
    }

    await user.save();
    res
      .status(200)
      .json({ message: "Product added to cart", cart: user.tasks.cart });
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

    // Check if product exists in the cart before removing
    const productInCart = user.tasks.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!productInCart) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    user.tasks.cart = user.tasks.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();
    res
      .status(200)
      .json({ message: "Product removed from cart", cart: user.tasks.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getCartItems = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Verify JWT and extract user email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only the user's cart
    res.status(200).json({ cart: user.tasks.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const placeOrder = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Decode JWT to get user details
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.tasks.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderId = new mongoose.Types.ObjectId().toString();

    const orderDate = new Date();

    // Create an array of order details to store in User's orderHistory
    const orderItems = [];

    // Iterate over cart items to group them by kitchen (owner)
    for (const item of user.tasks.cart) {
      const { productId, quantity, imageFile, price, kitchenName, name } = item;

      // Fetch product details and its associated owner
      const product = await Product.findById(productId).populate("ownerId");

      if (!product) continue;

      // Add product details to order items for user
      orderItems.push({
        productId,
        quantity,
        imageFile,
        price,
        name,
      });

      // Create order details for the particular owner
      const orderDetails = {
        orderId,
        items: [
          {
            productId,
            quantity,
            imageFile,
            price,
            name,
          },
        ],
        totalAmount: price * quantity,
        orderDate,
        status: "pending", 
      };

      const owner = await Owner.findById(product.ownerId);

      if (owner) {
        owner.orders.push(orderDetails);
        await owner.save(); 
      } else {
        console.error(`Owner not found for product: ${productId}`);
      }
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    user.tasks.orderHistory.push({
      orderId,
      items: orderItems,
      totalPrice: totalAmount,
      orderDate, 
      status: "pending", 
    });

    user.tasks.cart = [];

    await user.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderHistory: user.tasks.orderHistory,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(userId).populate(
      "tasks.orderHistory.items.productId"
    );

    if (
      !user ||
      !user.tasks.orderHistory ||
      user.tasks.orderHistory.length === 0
    ) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({
      message: "Orders fetched successfully",
      orders: user.tasks.orderHistory,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  removeItemFromCart,
  addItemToCart,
  getCartItems,
  placeOrder,
  getUserOrders,
};
