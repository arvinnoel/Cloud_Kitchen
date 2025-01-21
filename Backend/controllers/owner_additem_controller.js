const Product = require('../models/owner_additem_model');
const Owner = require('../models/owner_model');
const upload = require('../middleware/multerConfig');

// Add a Product
const addProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const imageFile = req.file;

  // Validate input
  if (!name || !price || !description || !imageFile) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find the logged-in owner
    const ownerId = req.owner?._id;
    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Create the product object
    const newProduct = {
      name,
      price,
      description,
      imageFile: `/uploads/${imageFile.filename}`,
    };

    // Add the product to the owner's products array
    owner.products.push(newProduct);

    // Save the product to the database
    const savedProduct = await Product.create({
      ownerId,
      name,
      price,
      description,
      imageFile: newProduct.imageFile,
    });

    // Save the owner with the updated product array
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

// Get Products for Logged-In Owner
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

module.exports = {
  addProduct,
  getAllProducts,
  getOwnerProducts,
};
