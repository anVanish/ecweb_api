const ApiResponse = require('../helper/ApiResponse')
const ErrorCodeManager = require('../helper/ErrorCodeManager')
const InputValidator = require('../helper/InputValidator')

class AuthController{
    
    //POST /api/auth/register
    register(req, res){
        const apiResponse = new ApiResponse()
        const email = req.body.email
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        
        //validation
        if (!email){
            apiResponse.message = 'Email is required'
            apiResponse.errorCode = ErrorCodeManager.MISSING_EMAIL
        } else if (!password){
            apiResponse.message = 'Password is required'
            apiResponse.errorCode = ErrorCodeManager.MISSING_PASSWORD
        } else if (password !== confirmPassword){
            apiResponse.message = 'Confirm password is not correct'
            apiResponse.errorCode = ErrorCodeManager.PASSWORD_CONFIRM_INCORRECT
        } else if (!InputValidator.validateEmail(email)){
            apiResponse.message = 'Invalid email format'
            apiResponse.errorCode = ErrorCodeManager.INVALID_EMAIL
        }
        else{
            apiResponse.success = true
            apiResponse.data = {
                email, password, confirmPassword
            }
        }

        res.json(apiResponse)
    }

    //POST /api/auth/login
    login(req, res){
        res.json("login")

    }

    //POST /api/auth/forgot-password
    forgotPassword(req, res){
        res.json("forgot password")
    }

    //POST /api/auth/verify-email
    verifyEmail(req, res){
        res.json('verify email')
    }

}

module.exports = new AuthController()
