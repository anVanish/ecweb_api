const ApiResponse = require('../helpers/ApiResponse')
const ErrorCodeManager = require('../helpers/ErrorCodeManager')
const InputValidator = require('../helpers/InputValidator')
const Users = require('../models/Users')
const MailService = require('../helpers/MailService')
const ErrorHandling = require('../helpers/ErrorHandling')
const TokenService = require('../helpers/TokenService')
const crypto = require('crypto')

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
                const code = new TokenService().generateAccessToken(savedUser._id, '1d')
                const link = `${req.protocol}://${req.get('host')}/api/auth/verify-email?code=${code}&email=${savedUser.email}`;
                return MailService.sendMail(savedUser.email, 'Welcome to our site', link);
            })
            .then(() => {
                apiResponse.success = true;
                apiResponse.message = 'Mail sent'
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
                if (!user.is_verified) {
                    apiResponse.setError('Email not verified', ErrorCodeManager.EMAIL_NOT_VERIFIED)
                    throw apiResponse
                }
                if (user.password !== password) {
                    apiResponse.setError('Icorrect Password', ErrorCodeManager.INCORRECT_PASSWORD)
                    throw apiResponse
                }
                
                const accessToken = new TokenService().generateAccessToken(user._id)
                apiResponse.data.accessToken = accessToken
                apiResponse.success = true

                res.json(apiResponse)
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(error, res);
            })
    }

    //GET /api/auth/forgot-password
    forgotPassword(req, res){
        const apiResponse = new ApiResponse()
        const email = req.query.email

        if (!email){
            apiResponse.setError('Missing Email', ErrorCodeManager.MISSING_EMAIL)
            return res.json(apiResponse)
        }
        if (!InputValidator.validateEmail(email)){
            apiResponse.setError('Invalid Email', ErrorCodeManager.INVALID_EMAIL)
            return res.json(apiResponse)
        }

        Users.findOne({email})
            .then((user) => {
                if (!user){
                    apiResponse.setError('Email not found', ErrorCodeManager.EMAIL_NOT_FOUND)
                    throw apiResponse
                }
                if (!user.is_verified){
                    apiResponse.setError('Email not verified', ErrorCodeManager.EMAIL_NOT_VERIFIED)
                    throw apiResponse
                }
                //generate resetCode and send mail
                const resetCode = new TokenService().generateAccessToken(user._id, '30m')
                const link = `Your reset password code is ${resetCode}`;
                return MailService.sendMail(user.email, 'Reset your password', link);
            })
            .then(() => {
                apiResponse.success = true
                apiResponse.message = 'Mail sent'
                res.json(apiResponse)
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(error, res)
            })
    }

    //POST /api/auth/forgot-password
    resetPassword(req, res){
        const apiResponse = new ApiResponse()
        const {password, confirmPassword, resetCode} = req.body

        if (!password){
            apiResponse.setError('Password is required', ErrorCodeManager.MISSING_PASSWORD)
            return res.json(apiResponse)
        }
        if (password !== confirmPassword){
            apiResponse.setError('Confirmed Password Incorrect', ErrorCodeManager.PASSWORD_CONFIRM_INCORRECT)
            return res.json(apiResponse)
        }
        if (!resetCode){
            apiResponse.setError('Reset Code is required', ErrorCodeManager.MISSING_RESET_CODE)
            return res.json(apiResponse)
        }

        const decodedData = new TokenService().decodeAccessToken(resetCode)
        if (!decodedData){
            apiResponse.setError('Invalid Reset Code', ErrorCodeManager.INVALID_RESET_CODE)
            return res.json(apiResponse)
        }

        Users.findOneAndUpdate({_id: decodedData.data}, {$set: {password}}, {new: true})
            .then((user) => {
                if (!user){
                    apiResponse.setError('User Not Found', ErrorCodeManager.USER_NOT_FOUND)
                    throw apiResponse
                }
                apiResponse.success = true
                res.json(apiResponse)
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(error, res)
            })
    }

    //GET /api/auth/verify-email
    verifyEmail(req, res){
        const apiResponse = new ApiResponse()
        const code = req.query.code

        if (!code) { 
            apiResponse.setError('Code is required', ErrorCodeManager.MISSING_VERIFY_CODE)
            return res.json(apiResponse)
        }

        const decodedData = new TokenService().decodeAccessToken(code)
        if (!decodedData){
            apiResponse.setError('Code is invalid or expired', ErrorCodeManager.INVALID_CODE)
            return res.json(apiResponse)
        }

        Users.findOne({_id: decodedData.data})
            .then((user) => {
                if (!user){
                    apiResponse.setError('Not found User', ErrorCodeManager.USER_NOT_FOUND)
                    throw apiResponse
                }
                if (user.is_verified){
                    apiResponse.setError('Email already verify', ErrorCodeManager.EMAIL_ALREADY_VERIFY)
                    throw apiResponse
                }

                user.is_verified = true
                return user.save()
            })
            .then(() => {
                apiResponse.success = true
                res.json(apiResponse)
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(error, res)
            })
        
        // Users.findOne({_id})
        //     .then((user) => {
        //         if (!user){
        //             apiResponse.setError('User not found', ErrorCodeManager.USER_NOT_FOUND);
        //             throw apiResponse;
        //         }
        //         if (user.verify_data.code !== code){
        //             apiResponse.setError('Verify code is not found', ErrorCodeManager.INCORRECT_CODE)
        //             throw apiResponse
        //         }
        //         if (user.verify_data.expired_date < new Date()) {
        //             apiResponse.setError('Verify code is expired', ErrorCodeManager.CODE_EXPIRED)
        //             throw apiResponse
        //         }
        //         user.verify_data.is_verified = true
        //         return user.save()
        //     })
        //     .then(() => {
        //         apiResponse.success = true
        //         res.json(apiResponse)
        //     })
        //     .catch((error) => {
        //         ErrorHandling.handleErrorResponse(error, res);
        //     })
    }
}

module.exports = new AuthController()
