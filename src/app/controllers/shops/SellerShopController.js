const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require("../../utils/InputValidator")
const ErrorHandling = require('../../utils/ErrorHandling')
const Users = require('../../models/Users')
const Shops = require('../../models/Shops')
const Products = require('../../models/Product')
const ApiResponse = require("../../utils/ApiResponse")
const ProfileResponse = require('../../utils/responses/ProfileResponse')

class SellerShopController{
    //seller authentication
    //GET /api/shops/me/products
    getMyShop(req, res){
        const _id = req.user._id
        Shops.findOne({sellerId: _id})
        .then((shop) => {
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.shop = shop
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //GET /api/shops/me/products
    async myShopProduct(req, res){
        const _id = req.user._id
        let limit = 10, page = 1
        const deleted = (req.query.deleted === 'true')
        const all = (req.query.all === 'true')
        if (req.query.page) page = parseInt(req.query.page)
        if (req.query.limit) limit = parseInt(req.query.limit)

        try {
            const shop = await Shops.findOne({sellerId: _id})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const products = await Products.findProducts({shopId: shop._id}, {deleted, all, new: true})
                .skip((page - 1) * limit)
                .limit(limit)
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.total = await Products.countProducts({shopId: shop._id}, {deleted, all})
            apiResponse.data.length = products.length
            apiResponse.data.products = products
            res.json(apiResponse)
        } catch(error) {
            ErrorHandling.handleErrorResponse(res, error)
        }
    }

    //POST /api/shops/me
    async registerSeller(req, res){
        const _id = req.user._id
        req.body.sellerId = _id
        const apiResponse = new ApiResponse()
        try{
            const error = InputValidator.invalidShop(req.body) 
            if (error) throw error

            const user = await Users.findOneUsers({_id})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND

            const shop = await Shops.findOne({sellerId: _id})
            if (shop){
                apiResponse.setSuccess('Already registered to seller')
                return res.json(apiResponse)
            }

            user.isSeller = true
            await user.save()
            await Shops.create(req.body)
            apiResponse.setSuccess('Seller registered')
            apiResponse.data.user = new ProfileResponse(user)
            res.json(apiResponse)
        } catch (error) {
            ErrorHandling.handleErrorResponse(res, error)
        }        
    }

    //PATCH /api/shops/me
    updateMyShop(req, res){
        const {_id} = req.user
        const error = InputValidator.invalidShop(req.body, {create: false})
        if (error) return ErrorHandling.handleErrorResponse(res, error)

        Shops.findOneAndUpdate({sellerId: _id}, req.body, {new: true})
        .then((shop) => {
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Shop updated')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //DELETE /api/shops/me
    deleteMyShop(req, res){
        const {_id} = req.user
        Shops.findOneAndDelete({sellerId: _id})
        .then((shop) => {
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Shop deleted')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }
}

module.exports = new SellerShopController()