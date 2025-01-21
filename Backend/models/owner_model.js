const mongoose = require('mongoose');

// Define the Product Schema
const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    imageFile: String,
  },
  { timestamps: true } // Add timestamps for products
);

// Define the Order Schema
const OrderSchema = new mongoose.Schema(
  {
    orderId: String,
    items: Array,
    totalAmount: Number,
    orderDate: Date,
    status: String,
  },
  { timestamps: true } // Add timestamps for orders
);

// Define the Owner Schema
const OwnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    kitchen_name: {
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

    // Embed the Product and Order Schemas
    products: [ProductSchema], // This will use the ProductSchema with timestamps
    orders: [OrderSchema], // This will use the OrderSchema with timestamps
  },
  { timestamps: true } // Add timestamps for the Owner document itself
);

const Owner = mongoose.model('Owner', OwnerSchema);

module.exports = Owner;
