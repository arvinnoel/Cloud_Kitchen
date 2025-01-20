const express = require('express')


const { registerOwner, loginOwner } = require('../controllers/owner_controller')


const OwnersignupRouter = express. Router()


OwnersignupRouter.post('/ownerregister', registerOwner)

OwnersignupRouter.post('/ownerlogin', loginOwner)


module.exports = OwnersignupRouter;

