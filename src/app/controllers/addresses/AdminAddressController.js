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

    async getDefaultAddress(req, res, next){
        try{
            const { userId } = req.params
            const user = await Users.findOneUsers({_id: userId})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            
            let addr = user.addresses.find((address) => address.default === true)
            if (!addr && user.addresses.length > 0){
                user.addresses[0].default = true
                addr = user.addresses[0]
            }
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
            //make sure address is have default            
            if (!user.addresses || user.addresses.length === 0) {
                req.body.default = true
            } else if (req.body.default) {
                user.addresses.forEach((address) => address.default = false)
            }

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

            if (user.addresses.length === 1 && !req.body.default) 
                throw ErrorCodeManager.ADDRESS_MUST_HAVE_DEFAULT
            else if (req.body.default)
                user.addresses.forEach((address) => address.default = false)
            
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
            if (user.addresses.length > 0) user.addresses[0].default = true
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