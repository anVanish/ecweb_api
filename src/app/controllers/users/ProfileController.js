const ApiResponse = require("../../utils/ApiResponse")
const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require("../../utils/InputValidator")
const Users = require("../../models/Users")
const ProfileResponse = require('../../utils/responses/ProfileResponse')


class ProfileController{
    //GET /api/users/me
    async getProfile(req, res, next){
        try{
            const _id = req.user._id

            const user = await Users.findOneUsers({_id}, {addPending: true})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            if (user.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess()
            apiResponse.data.user = new ProfileResponse(user)
            res.json(apiResponse)
        
        }catch(error){
            next(error)
        }
        
    }

    //PATCH /api/users/me
    async updateProfile(req, res, next){
        try{
            const _id = req.user._id
            const errorCode = InputValidator.invalidUser(req.body)
            if (errorCode) return next(errorCode)
    
            const user = await Users.findOneAndUpdateUsers({_id}, new ProfileResponse(req.body), {new: true, addPending: true})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            if (user.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Profile updated')
            apiResponse.data.user = new ProfileResponse(user)
            res.json(apiResponse)
        }catch(error){
            next(error)    
        }
        
    }

    //DELETE /api/users/me
    async deleteAccount(req, res, next){
        try{
            const _id = req.user._id

            const user = await Users.deleteUsersById(_id, {new: true})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Account deleted')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
        
    }
    
    //PATCH /api/users/me/restore
    async restoreAccount(req, res, next){
        try{
            const _id = req.user._id

            const user = await Users.findOneAndRestoreUsers({_id}, {new: true, pending: true})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Account restored')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }
}

module.exports = new ProfileController()