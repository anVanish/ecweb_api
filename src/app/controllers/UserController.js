const ApiResponse = require("../utils/ApiResponse")
const ErrorCodeManager = require("../utils/ErrorCodeManager")
const ErrorHandling = require("../utils/ErrorHandling")
const InputValidator = require("../utils/InputValidator")
const Users = require("../models/Users")

class UserController{ 

    //GET /api/users
    listUsers(req, res){
        Users.find({})
        .then((users) =>{
            const apiResponse = new ApiResponse()
            apiResponse.success = true
            apiResponse.data = users
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //GET /api/users/:userId
    detailUser(req, res){
        const userId = req.params.userId
        Users.findOne({_id: userId})
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.success = true
            apiResponse.data.user = user
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //POST /api/users
    addUser(req, res){
        const errorRequired = InputValidator.invalidAuth(req.body)
        if (errorRequired) return ErrorHandling.handleErrorResponse(res, errorRequired)
        const errorInput = InputValidator.invalidUser(req.body)
        if (errorInput) return ErrorHandling.handleErrorResponse(res, errorInput)

        const {email} = req.body
        Users.findOne({email})
        .then((foundUser) => {
            if (foundUser) throw ErrorCodeManager.EMAIL_ALREADY_EXISTS
            const user = new Users(req.body)
            return user.save()
        })
        .then((savedUser) => {
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Add user successfully')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //PATCH /api/users/:userId
    updateUser(req, res){
        const _id = req.params.userId
        if (!_id) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.MISSING_ID, 'User Id is required')
        const errorInput = InputValidator.invalidUser(req.body)
        if (errorInput) return ErrorHandling.handleErrorResponse(errorInput)

        Users.findByIdAndUpdate(_id, req.body, {new: true})
        .then((user) => {
            if (!user) throw ErrorHandling.handleErrorResponse(res, ErrorCodeManager.USER_NOT_FOUND)

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Update successfully')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    //DELETE /api/users/:userId
    deleteUser(req, res){
        const _id = req.params.userId
        if (!_id) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.MISSING_ID, 'User Id is required')
        
        Users.findByIdAndRemove(_id)
        .then((user) => {
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Delete user successful')
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(res, error)
        })
    }

    
}

module.exports = new UserController()