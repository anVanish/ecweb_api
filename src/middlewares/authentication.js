const tokenService = require('../app/services/TokenService')
const ErrorCodeManager = require('../app/utils/ErrorCodeManager')

function authenticateToken(req, res, next){
    const token = req.headers.authorization
    if (!token) {
        const error = ErrorCodeManager.UNAUTHORIZED
        error.message = 'Missing access token, add it to header Authorization: Bearer <you-access-token>'
        return next(error)
    }
    const decodedToken = tokenService.decodeAccessToken(token.split(' ')[1])

    if (!decodedToken) {
        const error = ErrorCodeManager.UNAUTHORIZED
        error.message = 'Access token is invalid, not correct or expired'
        return next(error)
    }
    req.user = decodedToken.user
    next()
}

function authenticateUser(req, res, next){
    if (!req.user || !req.user._id) {
        const error = ErrorCodeManager.UNAUTHORIZED
        error.message = 'Login is required'
        return next(error)
    }
    next()
}

function authenticateSeller(req, res, next){
    if (!req.user || !req.user.isSeller) {
        const error = ErrorCodeManager.UNAUTHORIZED
        error.message = 'You must be seller to do this action'
        return next(error)
    }
    next()
}

function authenticateAdmin(req, res, next){
    if (!req.user || !req.user.isAdmin) {
        const error = ErrorCodeManager.UNAUTHORIZED
        error.message = 'You must be admin to do this action'
        return next(error)
    }
    next()
}


module.exports = {authenticateToken, authenticateUser, authenticateAdmin, authenticateSeller}