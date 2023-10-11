const ApiResponse = require("../app/helpers/ApiResponse")
const ErrorCodeManager = require("../app/helpers/ErrorCodeManager")

function NotFoundError(req, res, next){
    const apiResponse = new ApiResponse()
    apiResponse.setError('Not found Error', ErrorCodeManager.NOT_FOUND)
    res.status(404).json(apiResponse)
}

module.exports = NotFoundError