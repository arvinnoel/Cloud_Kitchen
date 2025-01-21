const mongoose = require('mongoose');

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
    
    products: [
      {
        name: String,
        price: Number,
        description: String,
        imageFile: String,
      },
      { timestamps: true },
    ],
    orders: [
      {
        orderId: String,
        items: Array, 
        totalAmount: Number,
        orderDate: Date,
        status: String,
        
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

const Owner = mongoose.model('Owner', OwnerSchema);

module.exports = Owner;
