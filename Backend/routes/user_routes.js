const express = require('express')
const { registerUser, loginUser,removeItemFromCart,addItemToCart, getCartItems, placeOrder, getUserOrders} = require('../controllers/user_controller')
const userAuthMiddleware = require('../middleware/userAuthMiddleware');
const signupRouter = express. Router()

signupRouter.post('/register', registerUser)
signupRouter.post('/login', loginUser)
signupRouter.post('/register', registerUser)
signupRouter.post('/addtocart', addItemToCart)
signupRouter.delete('/removecartitem', removeItemFromCart)
signupRouter.get('/getcartitem', getCartItems)
signupRouter.post('/checkout',userAuthMiddleware, placeOrder)
signupRouter.get('/userorders',userAuthMiddleware, getUserOrders)
module.exports = signupRouter;

