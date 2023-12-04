const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require("../../utils/InputValidator")
const Users = require('../../models/Users')
const Shops = require('../../models/Shops')
const Products = require('../../models/Product')
const ApiResponse = require("../../utils/ApiResponse")
const ProfileResponse = require('../../utils/responses/ProfileResponse')

class SellerShopController{
    //seller authentication
    //GET /api/shops/me/products
    async getMyShop(req, res, next){
        try{
            const _id = req.user._id
            const shop = await Shops.findOne({sellerId: _id})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.shop = shop
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }

    //GET /api/shops/me/products
    async myShopProduct(req, res, next){
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
            next(error)
        }
    }

    //POST /api/shops/me
    async registerSeller(req, res, next){
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
            next(error)
        }        
    }

    //PATCH /api/shops/me
    async updateMyShop(req, res, next){
        try{
            const {_id} = req.user
            const error = InputValidator.invalidShop(req.body, {create: false})
            if (error) return next(error)
    
            const shop = await Shops.findOneAndUpdate({sellerId: _id}, req.body, {new: true})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Shop updated')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }

    //DELETE /api/shops/me
    async deleteMyShop(req, res, next){
        try{
            const {_id} = req.user
            const shop = await Shops.findOneAndDelete({sellerId: _id})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Shop deleted')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
       
    }
}

module.exports = new SellerShopController()