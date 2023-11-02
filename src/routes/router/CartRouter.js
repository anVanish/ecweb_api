const express = require('express')
const router = express.Router()
const {authenticateToken, authenticateUser} = require('../../middlewares/authentication')
const cartController = require('../../app/controllers/carts/CartController')

router.use(authenticateToken, authenticateUser)
router.get('/', cartController.listCarts)
router.post('/', cartController.addToCarts)
router.patch('/:cartItemId/variation', cartController.updateCartVariation)
router.patch('/:cartItemId/quantity', cartController.updateCartQuantity)
router.delete('/:cartItemId', cartController.deleteFromCarts)

module.exports = router