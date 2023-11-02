const express = require('express')
const router = express.Router()
const {authenticateSeller, authenticateAdmin, authenticateToken} = require('../../middlewares/authentication')
const shopController = require('../../app/controllers/shops/ShopController')
const sellerShopController = require('../../app/controllers/shops/SellerShopController')
const adminShopController = require('../../app/controllers/shops/AdminShopController')


//uri /api/shops
//seller
router.get('/me/products', authenticateToken, authenticateSeller, sellerShopController.myShopProduct)
router.get('/me', authenticateToken, authenticateSeller, sellerShopController.getMyShop)

//user + guest
router.get('/:shopId', shopController.detailShop)
router.get('/:shopId/products', shopController.shopProduct)


//authenticate
router.use(authenticateToken)

//seller
router.post('/me', sellerShopController.registerSeller)
router.patch('/me', authenticateSeller, sellerShopController.updateMyShop)
router.delete('/me', authenticateSeller, sellerShopController.deleteMyShop)

//admin
router.get('/', authenticateAdmin, adminShopController.listShop)
router.get('/:shopId/full', authenticateAdmin, adminShopController.fullShopDetail)
router.post('/:userId', authenticateAdmin, adminShopController.addShop)
router.patch('/:shopId', authenticateAdmin, adminShopController.updateShop)
router.delete('/:shopId', authenticateAdmin, adminShopController.deleteShop)

module.exports = router