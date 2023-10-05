const express = require('express')
const router = express.Router()
const authController = require('../../app/controller/AuthController')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/verify-email', authController.verifyEmail)

module.exports = router