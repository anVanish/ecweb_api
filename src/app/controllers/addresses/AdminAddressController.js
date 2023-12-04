const ApiResponse = require("../../utils/ApiResponse")
const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require("../../utils/InputValidator")
const Users = require("../../models/Users")

class AdminAddressController{
    //admin
    //GET /api/users/:userId/addresses
    async getAddresses(req, res, next){
        try{
            const _id = req.params.userId 
            const user = await Users.findOneUsers({_id})            
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.addresses = user.addresses
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }

    //GET /api/addresses/:addressId/:userId
    async getAddress(req, res, next){
        try{
            const { addressId, userId } = req.params
            const user = await Users.findOneUsers({_id: userId})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const addr = user.addresses.id(addressId)
            if (!addr) throw ErrorCodeManager.ADDRESS_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.success = true
            apiResponse.data.address = addr
            res.json(apiResponse)            
        }catch(error){
            next(error)
        }
    }

    //POST /api/users/:userId/addresses
    async addAddress(req, res){
        try{
            const _id = req.params.userId

            const error = InputValidator.invalidAddr(req.body) 
            if (error) throw error
    
            const user = await Users.findOneUsers({_id})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            user.addresses.push(req.body)
            await user.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Address added')
            res.json(apiResponse)   
        }catch(error){
            next(error)
        }
    }

    //PUT addresses/:addressId/:userId
    async updateAddress(req, res, next){
        try{
            const { addressId, userId } = req.params
            const error = InputValidator.invalidAddr(req.body)
            if (error) throw error
    
            const user = await Users.findOneUsers({_id: userId})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const addr = user.addresses.id(addressId)
            if (!addr) throw ErrorCodeManager.ADDRESS_NOT_FOUND
            
            Object.assign(addr, req.body)
            await user.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Address updated')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }

    //DELETE addresses/:addressId/:userId
    async deleteAddress(req, res, next){
        try{
            const { addressId, userId } = req.params

            const user = await Users.findOne({_id: userId})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const addr = user.addresses.id(addressId)
            if (!addr) throw ErrorCodeManager.ADDRESS_NOT_FOUND

            user.addresses = user.addresses.filter((address) => address._id !== addressId)
            await user.save()

            const apiResponse = new ApiResponse();
            apiResponse.setSuccess('Address deleted');
            res.json(apiResponse);
        }catch(error){
            next(error)
        }
    }
}


module.exports = new AdminAddressController()