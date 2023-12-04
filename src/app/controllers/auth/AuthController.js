const ApiResponse = require('../../utils/ApiResponse')
const ErrorCodeManager = require('../../utils/ErrorCodeManager')
const InputValidator = require('../../utils/InputValidator')
const Users = require('../../models/Users')
const MailService = require('../../services/MailService')
const tokenService = require('../../services/TokenService')
const ProfileResponse = require('../../utils/responses/ProfileResponse')

class AuthController{
    //POST /api/auth/register
    async register(req, res, next){
        try{
            const apiResponse = new ApiResponse()
            const {email, password, confirmPassword } = req.body
    
            const error = InputValidator.invalidAuth({email, password, confirmPassword})
            if (error) throw error
            
            const existUser = await Users.findOneUsers({email}, {addPending: true})
            if (existUser){
                if (!existUser.isVerified) throw ErrorCodeManager.EMAIL_PENDING_VERIFY
                if (existUser.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE
                throw ErrorCodeManager.EMAIL_ALREADY_EXISTS
            }
            const user = new Users({email, password})
            await user.save()

            const code = tokenService.generateAccessToken({_id: user._id}, '1d')
            const host = process.env.CLIENT_HOST ? process.env.CLIENT_HOST : 'http://localhost:3000'
            const link = `${host}/verifyEmail/${code}`;
            await MailService.sendMail(user.email, 'Welcome to our site', link)
            
            apiResponse.setSuccess('Mail sent')
            res.json(apiResponse);
        } catch(error){
            next(error)
        }
    }

    //POST /api/auth/login
    async login(req, res, next){
        try{
            const apiResponse = new ApiResponse()
            const {email, password} = req.body
            
            //validate
            const error = InputValidator.invalidAuth({email, password})
            if (error) throw error
            
            const user = await Users.findOneUsers({email}, {addPending: true})
            //verify
            if (!user) throw ErrorCodeManager.EMAIL_NOT_FOUND
            if (!user.isVerified) throw ErrorCodeManager.EMAIL_NOT_VERIFIED
            if (user.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE
            if (user.password !== password) throw ErrorCodeManager.INCORRECT_PASSWORD
           
            //generate access token
            const accessToken = tokenService.generateAccessToken({
                _id: user._id, 
                isSeller: user.isSeller, 
                isAdmin: user.isAdmin,
                isDeleted: user.isDeleted,
            })
            
            //information send to user
            const userLoggedIn = {
                _id: user._id,
                email: user.email,
                username: user.username,
                isSeller: user.isSeller,
                isAdmin: user.isAdmin
            }
            apiResponse.data.accessToken = accessToken
            apiResponse.data.user = userLoggedIn
            apiResponse.success = true
            res.json(apiResponse)
        } catch(error){
            next(error)
        }
        
    }

    //POST /api/auth/forgot-password
    async forgotPassword(req, res, next){
        try{
            const apiResponse = new ApiResponse()
            const email = req.body.email
            //verify input
            if (!email) throw ErrorCodeManager.MISSING_EMAIL
            if (!InputValidator.validateEmail(email)) throw ErrorCodeManager.INVALID_EMAIL
    
            const user = await Users.findOneUsers({email}, {addPending: true})
            //verify user
            if (!user) throw ErrorCodeManager.EMAIL_NOT_FOUND
            if (user.isDeleted) throw ErrorCodeManager.ACCOUNT_PENDING_DELETE
            if (!user.isVerified) throw ErrorCodeManager.EMAIL_PENDING_VERIFY

            //generate resetCode and send mail
            const resetCode = tokenService.generateAccessToken({_id: user._id}, '30m')
            const host = process.env.CLIENT_HOST ? process.env.CLIENT_HOST : 'http://localhost:3000'
            const link = `${host}/resetPass/${resetCode}`;
            await MailService.sendMail(user.email, 'Reset your password', link);
           
            apiResponse.setSuccess('Mail sent')
            res.json(apiResponse)
        } catch(error){
            next(error)
        }
        
    }

    //PATCH /api/auth/forgot-password
    async resetPassword(req, res, next){
        try{
            const apiResponse = new ApiResponse()
            const {password, confirmPassword, resetCode} = req.body
    
            if (!password) throw ErrorCodeManager.MISSING_PASSWORD
            if (password !== confirmPassword) throw ErrorCodeManager.PASSWORD_CONFIRM_INCORRECT
            if (!resetCode) throw ErrorCodeManager.MISSING_RESET_CODE
    
            const decodedData = tokenService.decodeAccessToken(resetCode)
            if (!decodedData) throw ErrorCodeManager.INVALID_RESET_CODE
    
            const user = await Users.findOneAndUpdate({_id: decodedData.user._id}, {$set: {password}}, {new: true})
                
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            apiResponse.setSuccess('Password reseted')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
        
    }

    //POST /api/auth/verify/email
    async verifyEmail(req, res, next){
        try{
            const apiResponse = new ApiResponse()
            const code = req.body.code

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
            next(error)
        }
    }

    //POST /api/auth/register/email
    async registerSendMail(req, res, next){
        //descirption: resend verify for user
        try{
            const apiResponse = new ApiResponse()
            const {email} = req.body

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
            next(error)
        }
    }
}

module.exports = new AuthController()
