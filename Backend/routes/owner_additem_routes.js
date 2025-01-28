const express = require('express');
const { addProduct, getAllProducts, getOwnerProducts,deleteProduct} = require('../controllers/owner_additem_controller');
const authMiddleware = require('../middleware/authMiddleware'); 
const userauthMiddleware = require('../middleware/userAuthMiddleware');
const upload = require('../middleware/multerConfig');

const productRouter = express.Router();

productRouter.post('/addproducts', authMiddleware, upload.single('imageFile'), addProduct);
productRouter.get('/getallproducts',userauthMiddleware, getAllProducts);
productRouter.get('/getownerproducts', authMiddleware, getOwnerProducts);
productRouter.delete('/deleteproduct/:productId', authMiddleware, deleteProduct);

module.exports = productRouter;
