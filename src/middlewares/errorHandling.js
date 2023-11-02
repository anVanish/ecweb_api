const CustomError = require('../app/utils/CustomError')
const ApiResponse = require('../app/utils/ApiResponse')
const ErrorCodeManager = require('../app/utils/ErrorCodeManager')

const errorHandling = function(err, req, res, next){
    const apiResponse = new ApiResponse()
    let status = 500
    if (err instanceof CustomError){
        apiResponse.setError(err.message, err.errorCode)
        status = err.status
    }
    else{
        console.error(err)
        apiResponse.setError(err.message, ErrorCodeManager.SERVER_ERROR.errorCode)
    }

    res.status(status).json(apiResponse)
}

module.exports = errorHandling