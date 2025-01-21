const mongoose = require('mongoose');

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

// Define the Order History Schema
const OrderHistorySchema = new mongoose.Schema(
  {
    orderId: String,
    items: [
      {
        productId: String,
        quantity: Number,
      },
    ],
    totalPrice: Number,
    orderDate: Date,
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
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
      orderHistory: [OrderHistorySchema], // Use OrderHistorySchema for order history
    },
  },
  { timestamps: true } // Add timestamps for the User document itself
);

const User = mongoose.model('User', userSchema);

module.exports = User;
