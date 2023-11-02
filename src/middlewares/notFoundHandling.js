const ApiResponse = require("../app/utils/ApiResponse")
const ErrorCodeManager = require("../app/utils/ErrorCodeManager")

function NotFoundError(req, res, next){
    const apiResponse = new ApiResponse()
    apiResponse.setError(ErrorCodeManager.NOT_FOUND.message, ErrorCodeManager.NOT_FOUND.errorCode)
    res.status(404).json(apiResponse)
}

module.exports = NotFoundError