class ErrorHandler extends Error{
    constructor(errorCode, status=500, message=''){
        super(message)
        this.errorCode = errorCode
        this.status = status

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandler