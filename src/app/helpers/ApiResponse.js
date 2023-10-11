
class ApiResponse{
    constructor(){
        this.success = false
        this.message = ''
        this.errorCode = ''
        this.data = {}
    }

    setError(message, errorCode){
        this.success = false
        this.message = message
        this.errorCode = errorCode
    }

    setSuccess(message){
        this.success = true
        this.message = message
    }
}

module.exports = ApiResponse
