const express = require('express')
const router = express.Router()
const {authenticateToken, authenticateSeller, authenticateAdmin, authenticateUser} = require('../../middlewares/authentication')
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
router.patch('/:productId/me/restore', authenticateSeller, sellerProductController.restoreMyProducts)
router.delete('/:productId/me/force', authenticateSeller, sellerProductController.forceDeleteMyProducts)
router.delete('/:productId/me', authenticateSeller, sellerProductController.deleteMyProduct)
//admin
router.post('/:shopId', authenticateAdmin, adminProductController.addProduct)
router.put('/:productId', authenticateAdmin, adminProductController.updateProduct)
router.patch('/:productId/restore', authenticateAdmin, adminProductController.restoreProduct)
router.delete('/:productId/force', authenticateAdmin, adminProductController.forceDeleteProduct)
router.delete('/:productId', authenticateAdmin, adminProductController.deleteProduct)


module.exports = router