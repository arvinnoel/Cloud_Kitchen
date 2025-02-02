const mongoose = require("mongoose");

// Define the Cart Item Schema
const CartItemSchema = new mongoose.Schema(
  {
    productId: String,
    quantity: Number,
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    imageFile: String,
    price: Number,
    kitchenName: String,
    name: String,
  },
  { timestamps: true } // Add timestamps for cart items
);

// Define the Wishlist Item Schema
const WishlistItemSchema = new mongoose.Schema(
  {
    productId: String,
    status: {
      type: String,
      enum: ["added", "removed"],
      default: "added",
    },
  },
  { timestamps: true } // Add timestamps for wishlist items
);

// Define the Order History Schema (Updated to include status tracking)
const OrderHistorySchema = new mongoose.Schema(
  {
    orderId: String,
    items: [
      {
        productId: String,
        quantity: Number,
        imageFile: String, // Added image
        price: Number, // Added price
        name: String, // Added name
      },
    ],
    totalPrice: Number,
    orderDate: {
      type: Date,
      default: Date.now, // Automatically set order date
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'canceled'],
      default: "pending", // Default status when order is placed
    },
  },
  { timestamps: true } // Add timestamps for order history
);

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    tasks: {
      cart: [CartItemSchema], // Use CartItemSchema for cart
      wishlist: [WishlistItemSchema], // Use WishlistItemSchema for wishlist
      orderHistory: [OrderHistorySchema], // Use updated OrderHistorySchema
    },
  },
  { timestamps: true } // Add timestamps for the User document itself
);

const User = mongoose.model("User", userSchema);

module.exports = User;
