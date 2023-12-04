const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require("../../utils/InputValidator")
const Shops = require('../../models/Shops')
const Users = require('../../models/Users')
const ApiResponse = require("../../utils/ApiResponse")
const ProfileResponse = require('../../utils/responses/ProfileResponse')


class AdminShopController{
    //admin authentication
    //GET /api/shops/
    async listShop(req, res, next){
        let page = 1
        let limit = 10
        let search = ''

        if (req.query.page) page = parseInt(req.query.page)
        if (req.query.limit) limit = parseInt(req.query.limit)
        if (req.query.search) search = req.query.search

        const filters = {$or:[
            {name: { $regex: `.*${search}.*`, $options: 'i' }},
            {description: { $regex: `.*${search}.*`, $options: 'i' }},
        ]}

        try {
            const shops = await Shops.find(filters)
                .skip((page - 1) * limit)
                .limit(limit)
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.total = await Shops.countDocuments(filters)
            apiResponse.data.length = shops.length
            apiResponse.data.shops = shops
            res.json(apiResponse)
        } catch (error){
            next(error)
        }
    }

    //GET /api/shops/:shopId/full
    fullShopDetail(req, res, next){
        res.json('full shop detail')
    }

    //POST /api/shops/:userId
    async addShop(req, res, next){
        const _id = req.params.userId
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

    //PATCH /api/shops/:shopId
    async updateShop(req, res, next){
        try{
            const _id = req.params.shopId
            const error = InputValidator.invalidShop(req.body, {create: false})
            if (error) return next(error)
            
            const {sellerId, ...other} = req.body
            const shop = await Shops.findOneAndUpdate({_id}, other, {new: true})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Shop updated')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }

    //DELETE /api/shops/:shopId
    async deleteShop(req, res, next){
        try{
            const _id = req.params.shopId
            const shop = await Shops.findOneAndDelete({ _id})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Shop deleted')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }
}

module.exports = new AdminShopController()