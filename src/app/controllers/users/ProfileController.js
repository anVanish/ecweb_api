const ApiResponse = require("../../utils/ApiResponse")
const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require("../../utils/InputValidator")
const Users = require("../../models/Users")
const ProfileResponse = require('../../utils/responses/ProfileResponse')


class ProfileController{
    //GET /api/users/me
    getProfile(req, res, next){
        const _id = req.user._id
        Users.findOneUsers({_id}, {addPending: true})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            if (user.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE

            const apiResponse = new ApiResponse()
            apiResponse.success = true
            apiResponse.data.user = new ProfileResponse(user)
            res.json(apiResponse)
        })
        .catch((error) => {
            next(error)
        })
    }

    //PATCH /api/users/me
    updateProfile(req, res, next){
        const _id = req.user._id
        const errorCode = InputValidator.invalidUser(req.body)
        if (errorCode) return next(errorCode)

        Users.findOneAndUpdateUsers({_id}, new ProfileResponse(req.body), {new: true, addPending: true})
        .then((updatedUser) => {
            if (!updatedUser) throw ErrorCodeManager.USER_NOT_FOUND
            if (updatedUser.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE
            const apiResponse = new ApiResponse()
            apiResponse.success = true
            apiResponse.data.user = new ProfileResponse(updatedUser)
            res.json(apiResponse)
        })
        .catch((error) => {
            next(error)
        })
    }

    //DELETE /api/users/me
    deleteAccount(req, res, next){
        const _id = req.user._id

        Users.deleteUsersById(_id, {new: true})
        .then((updatedUser) => {
            if (!updatedUser) throw ErrorCodeManager.USER_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Account deleted')
            res.json(apiResponse)
        })
        .catch((error) => {
            next(error)
        })
    }
    
    //PATCH /api/users/me/restore
    restoreAccount(req, res, next){
        const _id = req.user._id

        Users.findOneAndRestoreUsers({_id}, {new: true, pending: true})
        .then((user)=>{
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Account restored')
            res.json(apiResponse)
        })
        .catch((error)=>{
            next(error)
        })
    }
    
}

module.exports = new ProfileController()