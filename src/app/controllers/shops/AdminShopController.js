const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require("../../utils/InputValidator")
const ErrorHandling = require('../../utils/ErrorHandling')
const Shops = require('../../models/Shops')
const Users = require('../../models/Users')
const ApiResponse = require("../../utils/ApiResponse")
const ProfileResponse = require('../../utils/responses/ProfileResponse')


class AdminShopController{
    //admin authentication
    //GET /api/shops/
    async listShop(req, res){
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
            ErrorCodeManager.handleErrorResponse(res, error)
        }
    }

    //GET /api/shops/:shopId/full
    fullShopDetail(req, res){
        res.json('full shop detail')
    }

    //POST /api/shops/:userId
    async addShop(req, res){
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
            ErrorHandling.handleErrorResponse(res, error)
        }
    }

    //PATCH /api/shops/:shopId
    updateShop(req, res){
        const _id = req.params.shopId
        const error = InputValidator.invalidShop(req.body, {create: false})
        if (error) return ErrorHandling.handleErrorResponse(res, error)

        Shops.findOneAndUpdate({_id}, req.body, {new: true})
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

    //DELETE /api/shops/:shopId
    deleteShop(req, res){
        const _id = req.params.shopId
        Shops.findOneAndDelete({ _id})
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

module.exports = new AdminShopController()