const Product = require('../models/owner_additem_model');
const Owner = require('../models/owner_model');

const addProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const imageFile = req.file;

  if (!name || !price || !description || !imageFile) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find the logged-in owner
    const ownerId = req.owner._id;
    // Find the owner document
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
    // Save the product to the separate collection
    const savedProduct = await Product.create({
      ownerId,
      name,
      price,
      description,
      imageFile: `/uploads/${imageFile.filename}`,
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


const getAllProducts = async (req, res) => {
  try {
    console.log('Fetching all products...');
    const products = await Product.find(); // Fetch all products from the database
    console.log('Fetched products:', products);

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
    const owner = req.owner;

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
  addProduct,getAllProducts, getOwnerProducts
};
