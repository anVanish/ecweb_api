const ApiResponse = require('./ApiResponse')
const ErrorCodeManager = require('./ErrorCodeManager')

class ErrorHandling{
    static handleErrorResponse(res, error, message=''){
        const apiResponse = new ApiResponse()
        const status = ErrorCodeManager.getHttpStatus(error)
        //error is error code
        console.log(error)
        if (ErrorCodeManager.isContainErrorCode(error)){
            const errorMessage = !message ? ErrorCodeManager.getErrorMessage(error) : message
            apiResponse.setError(errorMessage, error)
            return res.status(status).json(apiResponse)
        }
        //error is another
        apiResponse.setError(error.message, ErrorCodeManager.SERVER_ERROR)
        return res.status(status).json(apiResponse)
    }
}
module.exports = ErrorHandling