const Product = require('../models/owner_additem_model');
const Owner = require('../models/owner_model');
const cloudinary = require('../middleware/cloudinary'); 
const mongoose = require('mongoose');

const addProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const imageFile = req.file;

  // Validate input fields
  if (!name || !price || !description || !imageFile) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    if (!imageFile.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only image files are allowed' });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size exceeds the 5MB limit' });
    }

    const cloudinaryResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'product_images' }, 
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      uploadStream.end(imageFile.buffer);
    });

    const imageUrl = cloudinaryResponse.secure_url;

    const ownerId = req.owner?._id;
    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const newProduct = { name, price, description, imageFile: imageUrl };
    owner.products.push(newProduct);

    const savedProduct = await Product.create({
      ownerId,
      name,
      price,
      description,
      imageFile: imageUrl,
    });

    await owner.save();

    res.status(201).json({
      message: 'Product added successfully',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Error in addProduct:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({
      message: 'Products fetched successfully',
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOwnerProducts = async (req, res) => {
  try {
    const ownerId = req.owner?._id;
    const owner = await Owner.findById(ownerId).populate('products');

    if (!owner || !owner.products || owner.products.length === 0) {
      return res.status(404).json({ message: 'No products found for this owner' });
    }

    res.status(200).json({
      message: 'Products fetched successfully',
      products: owner.products,
      kitchenName: owner.kitchen_name,
    });
  } catch (error) {
    console.error('Error fetching owner products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const owner = await Owner.findOne({ "products._id": productId });

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found or product not part of owner\'s products' });
    }

    const productIndex = owner.products.findIndex((item) => item._id.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in Owner products array' });
    }

    const productDetails = owner.products[productIndex];

    const productInOwnerAddItem = await Product.findOne({
      ownerId: owner._id, 
      name: productDetails.name, 
      price: productDetails.price, 
      description: productDetails.description, 
      imageFile: productDetails.imageFile, 
    });

    if (productInOwnerAddItem) {
      await Product.findByIdAndDelete(productInOwnerAddItem._id);
    } else {
      return res.status(404).json({ message: 'Product not found in OwnerAddItem collection' });
    }

    owner.products.splice(productIndex, 1);

    await owner.save();

    res.status(200).json({ message: 'Product deleted successfully from both collections' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getOwnerProducts,
  deleteProduct,
};
