const tokenService = require('../app/utils/TokenService')
const ErrorCodeManager = require('../app/utils/ErrorCodeManager')
const ErrorHandling = require('../app/utils/ErrorHandling')

function authenticateToken(req, res, next){
    const token = req.headers.authorization
    console.log(token)
    if (!token) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.UNAUTHORIZED, 'Missing Access Token')
    const decodedToken = tokenService.decodeAccessToken(token.split(' ')[1])
    if (!decodedToken) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.UNAUTHORIZED, 'Invalid access token')
    req.user = decodedToken.user
    next()
}

function authenticateUser(req, res, next){
    if (!req.user || !req.user._id) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.UNAUTHORIZED, "Required login")
    next()
}

function authenticateSeller(req, res, next){
    if (!req.user || !req.user.isSeller) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.UNAUTHORIZED, "You must be seller or no privilege to do this action")
    next()
}

function authenticateAdmin(req, res, next) {

    if (!req.user || !req.user.isAdmin) return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.UNAUTHORIZED, "Only admin can do this action")
    next()
}


module.exports = {authenticateToken, authenticateUser, authenticateAdmin, authenticateSeller}