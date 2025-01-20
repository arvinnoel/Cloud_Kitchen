const express = require('express')


const { registerAdmin, loginAdmin } = require('../controllers/admin_controller')


const AdminRouter = express. Router()


AdminRouter.post('/adminregister', registerAdmin)

AdminRouter.post('/adminlogin', loginAdmin)


module.exports = AdminRouter;

