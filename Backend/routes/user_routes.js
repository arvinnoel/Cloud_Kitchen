const express = require('express')
const { registerUser, loginUser,removeItemFromCart,addItemToCart, getCartItems} = require('../controllers/user_controller')
const signupRouter = express. Router()

signupRouter.post('/register', registerUser)
signupRouter.post('/login', loginUser)
signupRouter.post('/register', registerUser)
signupRouter.post('/addtocart', addItemToCart)
signupRouter.delete('/removecartitem', removeItemFromCart)
signupRouter.get('/getcartitem', getCartItems)
module.exports = signupRouter;

