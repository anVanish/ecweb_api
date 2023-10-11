const express = require('express')
const router = express.Router()
const userController = require('../../app/controllers/UserController')
const AuthenticateToken = require('../../middlewares/AuthenticateToken')

router.patch('/', AuthenticateToken, userController.updateUser)

module.exports = router