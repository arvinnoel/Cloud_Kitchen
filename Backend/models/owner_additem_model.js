const mongoose = require('mongoose');

const ownerAddItemSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true }, 
    name: { 
      type: String, required: true 
    },
    price: { 
      type: Number, required: true 
    },
    description: { 
      type: String, required: true
     },
    imageFile: { 
      type: String, required: true 
    }, 
  },
  { timestamps: true }
);

const Product = mongoose.model('OwnerAddItem', ownerAddItemSchema);

module.exports = Product;
