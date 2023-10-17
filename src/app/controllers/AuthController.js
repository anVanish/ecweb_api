const ApiResponse = require('../utils/ApiResponse')
const ErrorCodeManager = require('../utils/ErrorCodeManager')
const InputValidator = require('../utils/InputValidator')
const Users = require('../models/Users')
const MailService = require('../utils/MailService')
const ErrorHandling = require('../utils/ErrorHandling')
const tokenService = require('../utils/TokenService')

class AuthController{
    //POST /api/auth/register
    register(req, res){
        const apiResponse = new ApiResponse()
        const {email, password, confirmPassword } = req.body

        const error = InputValidator.invalidAuth({email, password, confirmPassword})
        if (error) return ErrorHandling.handleErrorResponse(res, error)

        Users.findOne({ email })
            .then((foundUser) => {
                if (foundUser) throw ErrorCodeManager.EMAIL_ALREADY_EXISTS

                const user = new Users({ email, password })
                return user.save()
            })
            .then((savedUser) => {
                console.log(savedUser)
                const code = tokenService.generateAccessToken({_id: savedUser._id}, '1d')
                const link = `${req.protocol}://${req.get('host')}/api/auth/verify-email?code=${code}&email=${savedUser.email}`;
                return MailService.sendMail(savedUser.email, 'Welcome to our site', link);
            })
            .then(() => {
                apiResponse.setSuccess('Mail sent')
                res.json(apiResponse);
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(res, error)
            })
    }

    //POST /api/auth/login
    login(req, res){
        const apiResponse = new ApiResponse()
        const {email, password} = req.body
        
        const error = InputValidator.invalidAuth({email, password})
        if (error) return ErrorHandling.handleErrorResponse(res, error)
        
        Users.findOne({email})
            .then((user) => {
                if (!user) throw ErrorCodeManager.EMAIL_NOT_FOUND
                if (!user.is_verified) throw ErrorCodeManager.EMAIL_NOT_VERIFIED
                if (user.password !== password) throw ErrorCodeManager.INCORRECT_PASSWORD
                
                const accessToken = tokenService.generateAccessToken({_id: user._id, is_admin: user.is_admin})
                apiResponse.data.accessToken = accessToken
                apiResponse.success = true

                res.json(apiResponse)
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(res, error)
            })
    }

    //POST /api/auth/forgot-password
    forgotPassword(req, res){
        const apiResponse = new ApiResponse()
        const email = req.body.email

        if (!email) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.MISSING_EMAIL)
        if (!InputValidator.validateEmail(email)) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.INVALID_EMAIL)

        Users.findOne({email})
            .then((user) => {
                if (!user) throw ErrorCodeManager.EMAIL_NOT_FOUND
                if (!user.is_verified) throw ErrorCodeManager.EMAIL_NOT_VERIFIED

                //generate resetCode and send mail
                const resetCode = tokenService.generateAccessToken({_id: user._id}, '30m')
                const link = `Your reset password code is ${resetCode}`;
                return MailService.sendMail(user.email, 'Reset your password', link);
            })
            .then(() => {
                apiResponse.setSuccess('Mail sent')
                res.json(apiResponse)
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(res, error)
            })
    }

    //PATCH /api/auth/forgot-password
    resetPassword(req, res){
        const apiResponse = new ApiResponse()
        const {password, confirmPassword, resetCode} = req.body

        if (!password) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.MISSING_PASSWORD)
        if (password !== confirmPassword) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.PASSWORD_CONFIRM_INCORRECT)
        if (!resetCode) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.MISSING_RESET_CODE)

        const decodedData = tokenService.decodeAccessToken(resetCode)
        if (!decodedData) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.INVALID_RESET_CODE)

        Users.findOneAndUpdate({_id: decodedData.data._id}, {$set: {password}}, {new: true})
            .then((user) => {
                if (!user) throw ErrorCodeManager.USER_NOT_FOUND
                
                apiResponse.success = true
                res.json(apiResponse)
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(res, error)
            })
    }

    //GET /api/auth/verify-email
    verifyEmail(req, res){
        const apiResponse = new ApiResponse()
        const code = req.query.code

        if (!code) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.MISSING_VERIFY_CODE)

        const decodedData = tokenService.decodeAccessToken(code)
        if (!decodedData) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.INVALID_CODE)
        console.log(decodedData)

        Users.findOne({_id: decodedData.data._id})
            .then((user) => {
                if (!user) throw ErrorCodeManager.USER_NOT_FOUND
                if (user.is_verified) throw ErrorCodeManager.EMAIL_ALREADY_VERIFY

                user.is_verified = true
                return user.save()
            })
            .then(() => {
                apiResponse.success = true
                res.json(apiResponse)
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(res, error)
            })
    }
}

module.exports = new AuthController()
