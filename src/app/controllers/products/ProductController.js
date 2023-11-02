const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const ApiResponse = require('../../utils/ApiResponse')
const Products = require('../../models/Product')
const {filterProducts} = require('../../utils/SearchFilters')

class ProductController{
    //GET /api/products
    async listProducts(req, res, next){

        const {filters, pagination, sort, options} = filterProducts(req.query)
        
        try{
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

    //GET /api/products/:slug
    detailProduct(req, res, next){
        const all = (req.query.all === 'true')
        const slug = req.params.slug
        Products.findOneProducts({slug}, {all})
        .populate('shopId', 'name follower')
        .then((product) => {
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.product = product
            res.json(apiResponse)
        })
        .catch((error) => {
            next(error)
        })
    }
}

module.exports = new ProductController()