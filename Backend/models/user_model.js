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
  { timestamps: true }
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
  { timestamps: true }
);

// Define the Order History Schema (Updated with "Out for Delivery" and "Delivered" statuses)
const OrderHistorySchema = new mongoose.Schema(
  {
    orderId: String,
    items: [
      {
        productId: String,
        quantity: Number,
        imageFile: String,
        price: Number,
        name: String,
      },
    ],
    totalPrice: Number,
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "out_for_delivery", "delivered", "rejected", "canceled", "preparing"],
      default: "pending",
    },
    address: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    paymentMode: {
      type: String,
      enum: ["COD", "UPI"],
      default: "COD",  
    },
  },
  { timestamps: true }
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
      cart: [CartItemSchema],
      wishlist: [WishlistItemSchema],
      orderHistory: [OrderHistorySchema],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
