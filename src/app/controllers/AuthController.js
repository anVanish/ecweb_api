const { Error } = require('mongoose')
const ApiResponse = require('../helpers/ApiResponse')
const ErrorCodeManager = require('../helpers/ErrorCodeManager')
const InputValidator = require('../helpers/InputValidator')
const Users = require('../models/Users')

class AuthController{
    
    //POST /api/auth/register
    register(req, res){
        const apiResponse = new ApiResponse()
        const email = req.body.email
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        
        //validation
        if (!email){
            apiResponse.setError('Email is required', ErrorCodeManager.MISSING_EMAIL)
            return res.json(apiResponse)
        } else if (!password){
            apiResponse.setError('Password is required', ErrorCodeManager.MISSING_PASSWORD)
            return res.json(apiResponse)
        } else if (password !== confirmPassword){
            apiResponse.setError('Confirm password is not correct', ErrorCodeManager.PASSWORD_CONFIRM_INCORRECT)
            return res.json(apiResponse)
        } else if (!InputValidator.validateEmail(email)){
            apiResponse.setError('Invalid email format', ErrorCodeManager.INVALID_EMAIL)
            return res.json(apiResponse)
        }

        //check user
        Users.findOne({email})
            .then((validUser)=>{
                if (!validUser){
                    const user = new Users({email: email, password: password})
                    return user.save()
                } else{
                    apiResponse.setError('Email already exists', ErrorCodeManager.EMAIL_ALREADY_EXISTS)
                    throw apiResponse
                }
            })
            .then((savedUser)=>{
                apiResponse.data.user = savedUser
                apiResponse.success = true
                res.json(apiResponse)
            })
            .catch((error)=>{
                if (error instanceof ApiResponse){
                    res.json(error)
                } else {
                    console.error(error)
                    apiResponse.setError('Database Error', ErrorCodeManager.DATABASE_ERROR)
                    res.json(apiResponse)
                }
            })
        
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
