const mongoose = require('mongoose');

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
      cart: [
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
      ],
      wishlist: [
        {
          productId: String,
          status: {
            type: String,
            enum: ["added", "removed"],
            default: "added",
          },
        },
      ],
      orderHistory: [
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
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
