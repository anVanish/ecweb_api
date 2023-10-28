const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const ErrorHandling = require('../../utils/ErrorHandling')
const Shops = require('../../models/Shops')
const Products = require('../../models/Product')
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
    async shopProduct(req, res){
        let page = 1, limit = 10, search = ''
        const deleted = (req.query.deleted === 'true')
        const all = (req.query.all === 'true')
        if (req.query.page) page = parseInt(req.query.page)
        if (req.query.limit) limit = parseInt(req.query.limit)
        if (req.query.search) search = req.query.search
        
        const shopId = req.params.shopId
        try {
            const products = await Products.findProducts({shopId}, {deleted, all})
                .skip((page - 1) * limit)
                .limit(limit)
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.total = await Products.countProducts({shopId}, {deleted, all})
            apiResponse.data.length = products.length
            apiResponse.data.products = products

            res.json(apiResponse)
        } catch(error) {
            ErrorHandling.handleErrorResponse(res, error)
        }
    }
}

module.exports = new ShopController()