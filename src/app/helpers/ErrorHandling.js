const ApiResponse = require('./ApiResponse')
const ErrorCodeManager = require('./ErrorCodeManager')

class ErrorHandling{
    static handleErrorResponse2(res, error){
        const apiResponse = new ApiResponse()
        if (error.errorCode){
            apiResponse.setError(error.message, error.errorCode)
        } else {
            console.error(error)
            apiResponse.setError('Server Error', ErrorCodeManager.SERVER_ERROR);
        }
        res.json(apiResponse)
    }
    static handleErrorResponse(res, error, message=''){
        const apiResponse = new ApiResponse()
        const status = ErrorCodeManager.getHttpStatus(error)
        //error is error code
        if (ErrorCodeManager.isContainErrorCode(error)){
            const errorMessage = !message ? ErrorCodeManager.getErrorMessage(error) : message
            apiResponse.setError(errorMessage, error)
            return res.status(status).json(apiResponse)
        }
        //error is another
        apiResponse.setError(error, ErrorCodeManager.SERVER_ERROR)
        return res.status(status).json(apiResponse)
    }
}
module.exports = ErrorHandling