const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require('../../utils/InputValidator')
const ApiResponse = require('../../utils/ApiResponse')
const Products = require('../../models/Product')
const Shops = require('../../models/Shops')

class SellerProductController{
    //POST /api/products/me
    async addMyProduct(req, res, next){
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
            next(error)
        }
    }

    //PUT /api/products/:productId/me
    async updateMyProduct(req, res, next){
        const _id = req.user._id
        const productId = req.params.productId
        try{
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID
            const shop = await Shops.findOne({sellerId: _id})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            req.body.shopId = shop._id.toHexString()

            const error = InputValidator.invalidProduct(req.body)
            if (error) throw error

            const product = await Products.findOneAndUpdate({_id: productId}, req.body, {new: true})
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product updated')
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //DELETE /api/products/:productId/me
    async deleteMyProduct(req, res, next){
        const _id = req.user._id
        const productId = req.params.productId
        try{
            if (!InputValidator.validateId(productId)) throw ErrorCodeManager.INVALID_PARAMS_ID
            const shop = await Shops.findOne({sellerId: _id})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            
            const product = await Products.findOneAndDeleteProducts({_id: productId, shopId: shop._id}, {new: true})
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product deleted')
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //PATCH /api/products/:productId/me/restore
    async restoreMyProducts(req, res, next){
        const sellerId = req.user._id
        const _id = req.params.productId
        try{
            const shop = await Shops.findOne({sellerId}, {new: true})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            
            const product = await Products.findOneAndRestoreProducts({shopId: shop._id, _id})
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product restored')
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //DELETE /api/products/:porductId/me/force
    async forceDeleteMyProducts(req, res, next){
        const sellerId = req.user._id
        const _id = req.params.productId

        try {
            const shop = await Shops.findOne({sellerId})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            const product = await Products.findOneAndDelete({_id, shopId: shop._id})
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product deleted')
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }
}

module.exports = new SellerProductController()