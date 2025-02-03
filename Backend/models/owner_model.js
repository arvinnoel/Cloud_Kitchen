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
    orderDate: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'canceled'],
      default: "pending",
    },
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
    orders: [OrderSchema],
  },
  { timestamps: true }
);

const Owner = mongoose.model("Owner", OwnerSchema);

module.exports = Owner;
