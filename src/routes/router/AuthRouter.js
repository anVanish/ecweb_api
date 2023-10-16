const express = require('express')
const router = express.Router()
const authController = require('../../app/controllers/AuthController')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.patch('/forgot-password', authController.resetPassword)
router.get('/verify-email', authController.verifyEmail)

module.exports = router