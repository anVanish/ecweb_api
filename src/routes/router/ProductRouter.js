const express = require('express')
const router = express.Router()
const {authenticateToken, authenticateSeller, authenticateAdmin, authenticateUser} = require('../../middlewares/AuthenticateToken')
const adminProductController = require('../../app/controllers/products/AdminProductController')
const sellerProductController = require('../../app/controllers/products/SellerProductController')
const productController = require('../../app/controllers/products/ProductController')

//no auth
router.get('/', productController.listProducts)
router.get('/:slug', productController.detailProduct)

router.use(authenticateToken)
//seller
router.post('/me', authenticateSeller, sellerProductController.addMyProduct)
router.put('/:productId/me', authenticateSeller, sellerProductController.updateMyProduct)
router.delete('/:productId/me', authenticateSeller, sellerProductController.deleteMyProduct)
//admin
router.post('/:shopId', authenticateAdmin, adminProductController.addProduct)
router.put('/:productId', authenticateAdmin, adminProductController.updateProduct)
router.delete('/:productId', authenticateAdmin, adminProductController.deleteProduct)


module.exports = router