const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const ErrorHandling = require('../../utils/ErrorHandling')
const Shops = require('../../models/Shops')
const ApiResponse = require("../../utils/ApiResponse")


class ShopController{
    //no authentication
    //GET /api/shops/:shopId
    detailShop(req, res){
        const _id = req.params.shopId
        Shops.findOne({_id})
        .then((shop) => {
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.shop = shop
            res.json(shop)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //GET /api/shops/:shopId/products
    shopProduct(req, res){
        res.json('products of shop')
    }
}

module.exports = new ShopController()