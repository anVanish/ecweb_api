const ApiResponse = require('../utils/ApiResponse')
const ErrorCodeManager = require('../utils/ErrorCodeManager')
const InputValidator = require('../utils/InputValidator')
const Users = require('../models/Users')
const MailService = require('../services/MailService')
const ErrorHandling = require('../utils/ErrorHandling')
const tokenService = require('../services/TokenService')
const ProfileResponse = require('../utils/responses/ProfileResponse')

class AuthController{
    //POST /api/auth/register
    register(req, res){
        const apiResponse = new ApiResponse()
        const {email, password, confirmPassword } = req.body

        const error = InputValidator.invalidAuth({email, password, confirmPassword})
        if (error) return ErrorHandling.handleErrorResponse(res, error)
        
        Users.findOneUsers({ email }, {addPending: true})
            .then((foundUser) => {
                if (foundUser){
                    if (!foundUser.isVerified) throw ErrorCodeManager.EMAIL_PENDING_VERIFY
                    if (foundUser.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE
                    throw ErrorCodeManager.EMAIL_ALREADY_EXISTS
                }
                
                const user = new Users({ email, password })
                return user.save()  
            })
            .then((savedUser) => {
                const code = tokenService.generateAccessToken({_id: savedUser._id}, '1d')
                const host = process.env.CLIENT_HOST ? process.env.CLIENT_HOST : 'http://localhost:3000'
                const link = `${host}/verifyEmail/${code}`;
                return MailService.sendMail(savedUser.email, 'Welcome to our site', link)
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
        
        Users.findOneUsers({email}, {addPending: true})
            .then((user) => {
                if (!user) throw ErrorCodeManager.EMAIL_NOT_FOUND
                if (!user.isVerified) throw ErrorCodeManager.EMAIL_NOT_VERIFIED
                if (user.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE
                if (user.password !== password) throw ErrorCodeManager.INCORRECT_PASSWORD
                
                const accessToken = tokenService.generateAccessToken({
                    _id: user._id, 
                    isSeller: user.isSeller, 
                    isAdmin: user.isAdmin,
                    isDeleted: user.isDeleted,
                })
                
                apiResponse.data.accessToken = accessToken
                apiResponse.data.user = new ProfileResponse(user)
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

        Users.findOneUsers({email}, {addPending: true})
            .then((user) => {
                if (!user) throw ErrorCodeManager.EMAIL_NOT_FOUND
                if (user.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE
                if (!user.isVerified) throw ErrorCodeManager.EMAIL_PENDING_VERIFY

                //generate resetCode and send mail
                const resetCode = tokenService.generateAccessToken({_id: user._id}, '30m')
                const host = process.env.CLIENT_HOST ? process.env.CLIENT_HOST : 'http://localhost:3000'
                const link = `${host}/resetPass/${resetCode}`;
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

        Users.findOneAndUpdate({_id: decodedData.user._id}, {$set: {password}}, {new: true})
            .then((user) => {
                if (!user) throw ErrorCodeManager.USER_NOT_FOUND
                apiResponse.success = true
                res.json(apiResponse)
            })
            .catch((error) => {
                ErrorHandling.handleErrorResponse(res, error)
            })
    }

    //POST /api/auth/verify/email
    async verifyEmail(req, res){
        const apiResponse = new ApiResponse()
        const code = req.body.code

        try{
            if (!code) throw ErrorCodeManager.MISSING_VERIFY_CODE
            const decodedData = tokenService.decodeAccessToken(code)
            if (!decodedData) throw ErrorCodeManager.INVALID_CODE

            const user = await Users.findOneUsers({_id: decodedData.user._id}, {addPending: true})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            if (user.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE
            if (user.isVerified){
                apiResponse.setSuccess('Email already verified')
                return res.json(apiResponse)
            }
            user.isVerified = true
            await user.save()
            apiResponse.setSuccess('Email verified')
            res.json(apiResponse)
        } catch (error){
            ErrorHandling.handleErrorResponse(res, error)
        }
    }

    //POST /api/auth/register/email
    async registerSendMail(req, res){
        //descirption: resend verify for user
        const {email} = req.body
        const apiResponse = new ApiResponse()
        
        try{
            if (!email) throw ErrorCodeManager.MISSING_EMAIL
            if (!InputValidator.validateEmail(email))throw ErrorCodeManager.INVALID_EMAIL
            
            const user = await Users.findOneUsers({email}, {addPending: true})
           
            if (!user) throw ErrorCodeManager.EMAIL_NOT_FOUND
            if (user.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE
            if (user.isVerified){
                apiResponse.setSuccess('Email already verified')
                return res.json(apiResponse)
            }

            const code = tokenService.generateAccessToken({_id: user._id}, '1d')
            const host = process.env.CLIENT_HOST ? process.env.CLIENT_HOST : 'http://localhost:3000'
            const link = `${host}/verifyEmail/${code}`;
            await MailService.sendMail(user.email, 'Welcome to our site', link)

            apiResponse.setSuccess('Mail sent')
            res.json(apiResponse)
        } catch (error) {
            ErrorHandling.handleErrorResponse(res, error)
        }
    }
}

module.exports = new AuthController()
