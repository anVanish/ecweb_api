const TokenService = require('../app/helpers/TokenService')
const ApiResponse = require('../app/helpers/ApiResponse')
const ErrorCodeManager = require('../app/helpers/ErrorCodeManager')

function authenticateToken(req, res, next) {
    const token = req.headers.authorization
    const apiResponse = new ApiResponse()

    if (!token){
        apiResponse.setError('Missing access token', ErrorCodeManager.UNAUTHORIZED)
        return res.status(401).json(apiResponse)
    }

    const decodedToken = new TokenService().decodeAccessToken(token.split(' ')[1])
    
    if (!decodedToken) {
        apiResponse.setError('Invalid access token', ErrorCodeManager.UNAUTHORIZED);
        return res.status(401).json(apiResponse);
    }

    req.token = decodedToken

    next()
    
}

module.exports = authenticateToken