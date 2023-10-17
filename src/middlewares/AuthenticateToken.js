const tokenService = require('../app/utils/TokenService')
const ApiResponse = require('../app/utils/ApiResponse')
const ErrorCodeManager = require('../app/utils/ErrorCodeManager')
const ErrorHandling = require('../app/utils/ErrorHandling')

function authenticateToken(req, res, next) {
    const token = req.headers.authorization
    const apiResponse = new ApiResponse()

    if (!token){
        return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.UNAUTHORIZED, 'Missing Access Token')
    }

    const decodedToken = tokenService.decodeAccessToken(token.split(' ')[1])
    
    if (!decodedToken) {
        return ErrorHandling.handleErrorResponse(res, ErrorCodeManager.UNAUTHORIZED, 'Invalid access token')
    }
    req.token = decodedToken
    next()
    
}

module.exports = authenticateToken