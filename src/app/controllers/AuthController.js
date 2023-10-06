const ApiResponse = require('../helpers/ApiResponse')
const ErrorCodeManager = require('../helpers/ErrorCodeManager')
const InputValidator = require('../helpers/InputValidator')
const Users = require('../models/Users')
const MailService = require('../helpers/MailService')
const ErrorHandling = require('../helpers/ErrorHandling')

class AuthController{
    
    //POST /api/auth/register
    register(req, res){
        const apiResponse = new ApiResponse()
        const {email, password, confirmPassword } = req.body

        const error = InputValidator.invalidAuth({email, password, confirmPassword})
        if (error){
            apiResponse.setError(error.message, error.errorCode)
            return res.json(apiResponse)
        }

        Users.findOne({ email })
        .then((foundUser) => {
            if (foundUser) {
                apiResponse.setError('Email already exists', ErrorCodeManager.EMAIL_ALREADY_EXISTS);
                throw apiResponse;
            }
            const user = new Users({ email, password });
            return user.save();
        })
        .then((savedUser) => {
            apiResponse.success = true;
            const link = `${req.protocol}://${req.get('host')}/api/auth/verify-email?code=${savedUser.verify_data.code}&id=${savedUser._id}`;
            return MailService.sendMail(savedUser.email, 'Welcome to our site', link);
        })
        .then(() => {
            res.json(apiResponse);
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(error, res);
        });
    }

    //POST /api/auth/login
    login(req, res){
        const apiResponse = new ApiResponse()
        const {email, password} = req.body
        
        const error = InputValidator.invalidAuth({email, password})
        if (error){
            apiResponse.setError(error.message, error.errorCode)
            return res.json(apiResponse)
        }
        
        Users.findOne({email})
        .then((user) => {
            if (!user){
                apiResponse.setError('Email not found', ErrorCodeManager.EMAIL_NOT_FOUND)
                throw apiResponse
            }
            if (!user.verify_data.is_verified) {
                apiResponse.setError('Email not verified', ErrorCodeManager.EMAIL_NOT_VERIFIED)
                throw apiResponse
            }
            if (user.password !== password) {
                apiResponse.setError('Icorrect Password', ErrorCodeManager.INCORRECT_PASSWORD)
                throw apiResponse
            }

            apiResponse.success = true
            res.json(apiResponse)
        })
        .catch((error) => {
            ErrorHandling.handleErrorResponse(error, res);
        })
    }

    //POST /api/auth/forgot-password
    forgotPassword(req, res){
        res.json("forgot password")
    }

    //POST /api/auth/verify-email
    verifyEmail(req, res){
        const apiResponse = new ApiResponse()
        const code = req.query.code
        const _id = req.query.id

        if (!code || !_id || code.trim() === '' || _id.trim() === ''){
            apiResponse.setError('Code or Id is required', ErrorCodeManager.NOT_FOUND_VERIFY_INFO)
            return res.json(apiResponse)
        }

        Users.findOne({_id})
            .then((user) => {
                if (!user){
                    apiResponse.setError('User not found', ErrorCodeManager.USER_NOT_FOUND);
                    throw apiResponse;
                }
                if (user.verify_data.code !== code){
                    apiResponse.setError('Verify code is not found', ErrorCodeManager.INCORRECT_CODE)
                    throw apiResponse
                }
                if (user.verify_data.expired_date < new Date()) {
                    apiResponse.setError('Verify code is expired', ErrorCodeManager.CODE_EXPIRED)
                    throw apiResponse
                }
                user.verify_data.is_verified = true
                return user.save()
            })
            .then(() => {
                apiResponse.success = true
                res.json(apiResponse)
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(error, res);
            })
    }
}

module.exports = new AuthController()
