const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require("../../utils/InputValidator")
const ErrorHandling = require('../../utils/ErrorHandling')
const Users = require('../../models/Users')
const Shops = require('../../models/Shops')
const ApiResponse = require("../../utils/ApiResponse")
const ProfileResponse = require('../../utils/responses/ProfileResponse')

class SellerShopController{
    //seller authentication
    //GET /api/shops/me
    getMyShop(req, res){
        res.json('my shop')
    }

    //GET /api/shops/me/products
    myShopProduct(req, res){
        res.json('products of my shop')
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
        res.json('update my shop')
    }

    //DELETE /api/shops/me
    deleteMyShop(req, res){
        res.json('delete my shop')
    }
}

module.exports = new SellerShopController()