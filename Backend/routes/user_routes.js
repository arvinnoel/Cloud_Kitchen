const express = require('express')
const { registerUser, loginUser,removeItemFromCart,addItemToCart,updateCartItemQuantity, getCartItems,getAllProducts, placeOrder, getUserOrders} = require('../controllers/user_controller')
const userAuthMiddleware = require('../middleware/userAuthMiddleware');
const userRouter = express. Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/register', registerUser)
userRouter.post('/addtocart', addItemToCart)
userRouter.delete('/removecartitem', removeItemFromCart)
userRouter.get('/getcartitem', getCartItems)
userRouter.get('/getallproducts', getAllProducts)
userRouter.post('/checkout',userAuthMiddleware, placeOrder)
userRouter.get('/userorders',userAuthMiddleware, getUserOrders)
userRouter.put('/updatecartquantity', updateCartItemQuantity)
module.exports = userRouter;

