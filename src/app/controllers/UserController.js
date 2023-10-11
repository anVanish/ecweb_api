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
        
        const name = req.body.name
        const phone = req.body.phone
        const gender = req.body.gender
        const birthday = req.body.birthday
        const user = {name, phone, gender, birthday}

        const errorCode = InputValidator.invalidUser(user)
        if (errorCode) return ErrorHandling.handleErrorResponse(res, errorCode)

        Users.findByIdAndUpdate(_id, user, {new: true})
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