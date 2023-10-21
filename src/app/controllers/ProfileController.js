const ApiResponse = require("../utils/ApiResponse")
const ErrorCodeManager = require("../utils/ErrorCodeManager")
const ErrorHandling = require("../utils/ErrorHandling")
const InputValidator = require("../utils/InputValidator")
const Users = require("../models/Users")
const ProfileResponse = require('../utils/ProfileResponse')

class ProfileController{
    //GET /api/users/me
    getProfile(req, res){
        const _id = req.user._id
        Users.findOne({_id})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.success = true
            apiResponse.data.user = new ProfileResponse(user)
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(error)
        })
    }

    //POST /api/users/me
    registerSeller(req, res){
        res.json('register seller')
    }

    //PATCH /api/users/me
    updateProfile(req, res){
        const _id = req.user._id
        const errorCode = InputValidator.invalidUser(req.body)
        if (errorCode) return ErrorHandling.handleErrorResponse(res, errorCode)

        Users.findByIdAndUpdate(_id, req.body, {new: true})
        .then((updatedUser) => {
            if (!updatedUser) throw ErrorCodeManager.USER_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.success = true
            apiResponse.data.user = new ProfileResponse(updatedUser)
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //DELETE /api/users/me
    deleteAccount(req, res){
        res.json('delete account')
    }

}

module.exports = new ProfileController()