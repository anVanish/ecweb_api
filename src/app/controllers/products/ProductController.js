const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const ErrorHandling = require('../../utils/ErrorHandling')
const ApiResponse = require('../../utils/ApiResponse')
const Products = require('../../models/Product')

class ProductController{
    //GET /api/products
    listProducts(req, res){
        Products.find({})
        .then((products) => {
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.length = products.length
            apiResponse.data.products = products
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //GET /api/products/:slug
    detailProduct(req, res){
        const slug = req.params.slug
        Products.findOne({slug})
        .populate('shopId', 'name follower')
        .then((product) => {
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.product = product
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }
}

module.exports = new ProductController()