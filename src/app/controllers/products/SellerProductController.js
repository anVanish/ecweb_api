const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const ErrorHandling = require('../../utils/ErrorHandling')
const InputValidator = require('../../utils/InputValidator')
const ApiResponse = require('../../utils/ApiResponse')
const Products = require('../../models/Product')
const Shops = require('../../models/Shops')

class SellerProductController{
    //POST /api/products/me
    async addMyProduct(req, res){
        const _id = req.user._id
        try {
            const shop = await Shops.findOne({sellerId: _id})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            req.body.shopId = shop._id.toHexString()

            const error = InputValidator.invalidProduct(req.body)
            if (error) throw error

            const product = new Products(req.body)
            await product.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product added')
            res.json(apiResponse)
        } catch(error) {
            ErrorHandling.handleErrorResponse(res, error)
        }
    }

    //PATCH /api/products/:productId/me
    async updateMyProduct(req, res){
        res.json('update product in my shop')
        const _id = req.user._id
        const productId = req.params.productId
        try{
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID
            const shop = await Shops.findOne({sellerId: _id})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            req.body.shopId = shop._id.toHexString()

            const error = InputValidator.invalidProduct(req.body)
            if (error) throw error

            const product = Products.findOne({_id: productId})
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product updated')
            res.json(apiResponse)
        } catch(error) {
            ErrorHandling.handleErrorResponse(res, error)
        }
    }

    //DELETE /api/products/:productId/me
    deleteMyProduct(req, res){
        res.json('delete product in my shop')
    }

    //GET /api/products/:productId/me
}

module.exports = new SellerProductController()