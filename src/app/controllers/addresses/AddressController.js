const ApiResponse = require("../../utils/ApiResponse")
const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require("../../utils/InputValidator")
const Users = require("../../models/Users")

class AddressController{
    //my address
    //GET /api/users/me/addresses
    getMyAddresses(req, res, next){
        const _id = req.user._id
        Users.findOneUsers({_id})
        .then((user)=>{
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.addresses = user.addresses
            res.json(apiResponse)
        })
        .catch((error) => {
            next(error)
        })
    }
    
    //GET /api/addresses/:addressId/me
    getMyAddress(req, res, next){
        const _id = req.user._id
        const { addressId } = req.params
        Users.findOneUsers({_id})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const addr = user.addresses.id(addressId)
            if (!addr) throw ErrorCodeManager.ADDRESS_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.success = true
            apiResponse.data.address = addr
            res.json(apiResponse)
        })
        .catch((error) => {
            next(error)
        })
    }
    
    //POST /api/users/me/addresses
    addMyAddress(req, res, next){
        const _id = req.user._id

        const error = InputValidator.invalidAddr(req.body) 
        if (error) return next(error)

        Users.findOneUsers({_id})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            
            user.addresses.push(req.body)
            return user.save()
        })
        .then(() => {
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Address added')
            res.json(apiResponse)
        })
        .catch((error) => {
            next(error)
        })
    }

    //PUT addresses/:addressId/me
    updateMyAddress(req, res, next){
        const _id = req.user._id
        const { addressId } = req.params
        const error = InputValidator.invalidAddr(req.body)
        if (error) return next(error)

        Users.findOneUsers({_id})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const addr = user.addresses.id(addressId)
            if (!addr) throw ErrorCodeManager.ADDRESS_NOT_FOUND
            
            Object.assign(addr, req.body)
            return user.save()
        })
        .then(() => {
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Address updated')
            res.json(apiResponse)
        })
        .catch((error) => {
            next(error)
        })
    }

    //DELETE addresses/:addressId/me
    deleteMyAddress(req, res, next){
        const _id = req.user._id
        const { addressId } = req.params

        Users.findOne({_id})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const addr = user.addresses.id(addressId)
            if (!addr) throw ErrorCodeManager.ADDRESS_NOT_FOUND

            user.addresses = user.addresses.filter((address) => address._id != addressId)
            return user.save()
        })
        .then(() => {
            const apiResponse = new ApiResponse();
            apiResponse.setSuccess('Address deleted');
            res.json(apiResponse);
        })
        .catch((error) => {
            next(error)
        })
    }
}

module.exports = new AddressController()