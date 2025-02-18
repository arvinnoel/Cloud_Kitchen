const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    imageFile: String,
  },
  { timestamps: true }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: String,
    items: Array,
    totalAmount: Number,
    orderDate: {
      type: Date,
      default: Date.now, // Automatically set order date
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'out_for_delivery', 'delivered', 'rejected', 'canceled', 'preparing'],
      default: "pending",
    },
    address: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String
    },
    paymentMode: {
      type: String,
      enum: ['COD', 'UPI'],
      default: 'COD', // Default to "COD"
    }
  },
  { timestamps: true }
);

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

    products: [ProductSchema],
    orders: [OrderSchema], // Orders now include paymentMode and address
  },
  { timestamps: true }
);

const Owner = mongoose.model("Owner", OwnerSchema);

module.exports = Owner;
