const ApiResponse = require("../../utils/ApiResponse")
const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const ErrorHandling = require("../../utils/ErrorHandling")
const InputValidator = require("../../utils/InputValidator")
const Users = require("../../models/Users")

class AdminAddressController{
    //admin
    //GET /api/users/:userId/addresses
    getAddresses(req, res){
        const _id = req.params.userId 
        Users.findOneUsers({_id})
        .then((user)=>{
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.addresses = user.addresses
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //GET /api/addresses/:addressId/:userId
    getAddress(req, res){
        const { addressId, userId } = req.params
        Users.findOneUsers({_id: userId})
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
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //POST /api/users/:userId/addresses
    addAddress(req, res){
        const _id = req.params.userId

        const error = InputValidator.invalidAddr(req.body) 
        if (error) return ErrorHandling.handleErrorResponse(res, error)

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
                ErrorHandling.handleErrorResponse(res, error)
            })
    }

    //PUT addresses/:addressId/:userId
    updateAddress(req, res){
        const { addressId, userId } = req.params
        const error = InputValidator.invalidAddr(req.body)
        if (error) return ErrorHandling.handleErrorResponse(res, error)

        Users.findOneUsers({_id: userId})
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
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //DELETE addresses/:addressId/:userId
    deleteAddress(req, res){
        const { addressId, userId } = req.params

        Users.findOne({_id: userId})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const addr = user.addresses.id(addressId)
            if (!addr) throw ErrorCodeManager.ADDRESS_NOT_FOUND

            user.addresses = user.addresses.filter((address) => address._id !== addressId)
            return user.save()
        })
        .then(() => {
            const apiResponse = new ApiResponse();
            apiResponse.setSuccess('Address deleted');
            res.json(apiResponse);
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }
}


module.exports = new AdminAddressController()