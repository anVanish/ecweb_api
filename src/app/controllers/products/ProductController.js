const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const ErrorHandling = require('../../utils/ErrorHandling')
const ApiResponse = require('../../utils/ApiResponse')
const Products = require('../../models/Product')

class ProductController{
    //GET /api/products
    async listProducts(req, res){
        let page = 1, limit = 10, search = ''
        const deleted = (req.query.deleted === 'true')
        const all = (req.query.all === 'true')

        if (req.query.page) page = parseInt(req.query.page)
        if (req.query.limit) limit = parseInt(req.query.limit)
        if (req.query.search) search = req.query.search

        try{
            const products = await Products.findProducts({}, {deleted, all})
                .skip((page - 1) * limit)
                .limit(limit)
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.total = await Products.countProducts({}, {deleted, all})
            apiResponse.data.length = products.length
            apiResponse.data.products = products
            res.json(apiResponse)
        } catch(error) {
            ErrorHandling.handleErrorResponse(res, error)
        }
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