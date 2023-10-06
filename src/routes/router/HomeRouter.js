const express = require('express')
const router = express.Router()
const homeController = require('../../app/controllers/HomeController')
const authenticateToken = require('../../middlewares/AuthenticateToken')

router.get('/', authenticateToken, homeController.home)

module.exports = router