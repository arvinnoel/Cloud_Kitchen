const express = require('express');
const multer = require('multer');
const { addProduct, getAllProducts, getOwnerProducts } = require('../controllers/owner_additem_controller');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware
const userauthMiddleware = require('../middleware/userAuthMiddleware');
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Directory where images are stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

const productRouter = express.Router();

// Ensure that the owner is authenticated before allowing them to add a product
productRouter.post('/addproducts', authMiddleware, upload.single('imageFile'), addProduct);
productRouter.get('/getallproducts',userauthMiddleware, getAllProducts);
productRouter.get('/getownerproducts', authMiddleware, getOwnerProducts);

module.exports = productRouter;
