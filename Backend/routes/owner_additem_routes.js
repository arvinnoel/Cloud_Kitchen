const express = require('express');
const { addProduct, getOwnerProducts,deleteProduct, getOwnerOrders,updateOrderStatus} = require('../controllers/owner_additem_controller');
const authMiddleware = require('../middleware/authMiddleware'); 
const userauthMiddleware = require('../middleware/userAuthMiddleware');
const upload = require('../middleware/multerConfig');

const productRouter = express.Router();

productRouter.post('/addproducts', authMiddleware, upload.single('imageFile'), addProduct);
productRouter.get('/getownerproducts', authMiddleware, getOwnerProducts);
productRouter.delete('/deleteproduct/:productId', authMiddleware, deleteProduct);
productRouter.get('/getownerorders', authMiddleware, getOwnerOrders);
productRouter.put('/updateorderstatus', authMiddleware, updateOrderStatus);

module.exports = productRouter;
