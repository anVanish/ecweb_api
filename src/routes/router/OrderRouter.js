const express = require('express')
const router = express.Router()
const {authenticateToken, authenticateUser, authenticateSeller, authenticateAdmin} = require('../../middlewares/authentication')
const orderController = require('../../app/controllers/orders/OrderController')
const sellerOrderController = require('../../app/controllers/orders/SellerOrderController')
const adminOrderController = require('../../app/controllers/orders/AdminOrderController')

router.use(authenticateToken)
router.post('/checkout/code', orderController.getCheckOutCode)
router.get('/checkout', orderController.checkout)

//user
router.get('/me', authenticateUser, orderController.listMyOrders)
router.get('/:orderId/me', authenticateUser, orderController.detailMyOrder)
router.post('/me', authenticateUser, orderController.addMyOrder)
router.patch('/:orderId/me/address', authenticateUser, orderController.updateMyOrder) 
router.delete('/:orderId/me', authenticateUser, orderController.cancelMyOrder) 
//seller
router.get('/shop', authenticateSeller, sellerOrderController.listShopOrders)
router.get('/:orderId/shop', authenticateSeller, sellerOrderController.detailShopOrder)
router.patch('/:orderId/confirm', authenticateSeller, sellerOrderController.confirmShopOrder)
router.delete('/:orderId/shop', authenticateSeller, sellerOrderController.cancelShopOrder)
//admin
router.get('/', authenticateAdmin, adminOrderController.listOrders)
router.get('/:orderId', authenticateAdmin, adminOrderController.detailOrder)
router.post('/', authenticateAdmin, adminOrderController.addOrder)
router.patch('/:orderId/status', authenticateAdmin, adminOrderController.updateOrderStatus)
router.patch('/:orderId/address', authenticateAdmin, adminOrderController.updateOrderAddress)
router.delete('/:orderId', authenticateAdmin, adminOrderController.cancelOrder)

module.exports = router
