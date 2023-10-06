const ApiResponse = require('./ApiResponse')

class ErrorHandling{
    static handleErrorResponse(error, res){
        const apiResponse = new ApiResponse()
        if (error.errorCode){
            apiResponse.setError(error.message, error.errorCode)
        } else {
            console.error(error)
            apiResponse.setError('Database Error', ErrorCodeManager.DATABASE_ERROR);
        }
        res.json(apiResponse)
    }
}
module.exports = ErrorHandling