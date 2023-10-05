
class ApiResponse{
    constructor(){
        this.success = false
        this.message = ''
        this.errorCode = ''
        this.data = {}
    }

    setError(message, errorCode){
        this.message = message
        this.errorCode = errorCode
    }
}

module.exports = ApiResponse
