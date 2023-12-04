const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const Shops = require('../../models/Shops')
const Products = require('../../models/Product')
const ApiResponse = require("../../utils/ApiResponse")
const {filterProducts} = require('../../utils/SearchFilters')


class ShopController{
    //no authentication
    //GET /api/shops/:shopId
    async detailShop(req, res, next){
        try{
            const _id = req.params.shopId
            const shop = await Shops.findOne({_id})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess()
            apiResponse.data.shop = shop
            res.json(shop)
        }catch(error){
            next(error)
        }
    }

    //GET /api/shops/:shopId/products
    async shopProduct(req, res, next){
        const shopId = req.params.shopId
        const {pagination, filters, sort, options} = filterProducts(req.query, {shopId})
        
        try {
            const products = await Products.findProducts(filters, options)
                .sort(sort)
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit)
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.total = await Products.countProducts(filters, options)
            apiResponse.data.length = products.length
            apiResponse.data.products = products

            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }
}

module.exports = new ShopController()