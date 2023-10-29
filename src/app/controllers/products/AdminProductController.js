const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const ErrorHandling = require('../../utils/ErrorHandling')
const InputValidator = require('../../utils/InputValidator')
const ApiResponse = require('../../utils/ApiResponse')
const Products = require('../../models/Product')
const Shops = require('../../models/Shops')
const slugify = require('slugify')
const crypto = require('crypto')

class AdminProductController{
    //POST /api/products/:shopId
    async addProduct(req, res){
        const _id = req.params.shopId
        try {
            const error = InputValidator.invalidProduct(req.body)
            if (error) throw error

            const shop = await Shops.findOne({_id})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const product = new Products(req.body)
            await product.save()
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product added')
            res.json(apiResponse)
        } catch(error) {
            ErrorHandling.handleErrorResponse(res, error)
        }
    }

    //PUT /api/products/:productId
    updateProduct(req, res){
        const _id = req.params.productId
        if (!InputValidator.validateId(_id)) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.INVALID_PARAMS_ID)
        const error = InputValidator.invalidProduct(req.body)
        if (error) return ErrorHandling.handleErrorResponse(res, error)

        Products.findOneAndUpdate({_id}, req.body, {new: true})
        .then((product) => {
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product updated')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })

    }

    //DELETE /api/products/:productId
    deleteProduct(req, res){
        const _id = req.params.productId
        Products.findOneAndDeleteProducts({_id}, {new: true})
        .then((product) => {
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product deleted')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })

    }
        
    //PATCH /api/products/:productId/restore
    restoreProduct(req, res){
        const _id = req.params.productId
        Products.findOneAndRestoreProducts({_id}, {new: true})
        .then((product) => {
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product restored')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //DELETE /api/products/:porductId/force
    forceDeleteProduct(req, res){
        const _id = req.params.productId
        Products.findOneAndDelete({_id})
        .then((product) => {
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product deleted')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }
}

module.exports = new AdminProductController()