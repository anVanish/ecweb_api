const ApiResponse = require("../helpers/ApiResponse")
const ErrorCodeManager = require("../helpers/ErrorCodeManager")
const ErrorHandling = require("../helpers/ErrorHandling")
const InputValidator = require("../helpers/InputValidator")
const Users = require("../models/Users")


class UserController{

    //PATCH /api/user
    updateUser(req, res){
        const _id = req.token.data
        if (!_id) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.UNAUTHORIZED, 'Required Login')

        const errorCode = InputValidator.invalidUser(req.body)
        if (errorCode) return ErrorHandling.handleErrorResponse(res, errorCode)

        Users.findByIdAndUpdate(_id, req.body, {new: true})
        .then((updatedUser) => {
            if (!updatedUser) throw ErrorCodeManager.USER_NOT_FOUND
            const apiResponse = new ApiResponse()
            apiResponse.success = true
            apiResponse.data.user = updatedUser
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorCodeManager.handleErrorResponse(error)
        })
    }
}

module.exports = new UserController()