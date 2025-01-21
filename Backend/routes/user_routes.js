const express = require('express')


const { registerUser, loginUser,removeItemFromCart,addItemToCart} = require('../controllers/user_controller')


const signupRouter = express. Router()


signupRouter.post('/register', registerUser)

signupRouter.post('/login', loginUser)

signupRouter.post('/register', registerUser)
signupRouter.post('/addtocart', addItemToCart)
signupRouter.post('/removecartitem', removeItemFromCart)
module.exports = signupRouter;

