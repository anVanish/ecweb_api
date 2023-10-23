
class ErrorCodeManager{
    //register
    static get MISSING_EMAIL(){ return "MISSING_EMAIL"}
    static get MISSING_PASSWORD(){ return "MISSING_PASSWORD"}
    static get PASSWORD_CONFIRM_INCORRECT(){ return "PASSWORD_CONFIRM_INCORRECT"}
    static get INVALID_EMAIL(){ return "INVALID_EMAIL"}
    static get EMAIL_ALREADY_EXISTS(){ return "EMAIL_ALREADY_EXISTS"}
    static get FAILURE_SENT_MAIL(){return "FAILURE_SENT_MAIL"}

    //verify email
    static get MISSING_VERIFY_CODE(){return "MISSING_VERIFY_CODE"}
    static get USER_NOT_FOUND(){return "USER_NOT_FOUND"}
    static get CODE_EXPIRED(){return "CODE_EXPIRED"}
    static get INVALID_CODE(){return "INVALID_CODE"}
    static get EMAIL_ALREADY_VERIFY(){return "EMAIL_ALREADY_VERIFY"}

    //login
    static get EMAIL_NOT_FOUND(){return "EMAIL_NOT_FOUND"}
    static get EMAIL_NOT_VERIFIED(){return "EMAIL_NOT_VERIFIED"}
    static get INCORRECT_PASSWORD(){return "INCORRECT_PASSWORD"}
    
    //authenticate
    static get UNAUTHORIZED(){return "UNAUTHORIZED"}

    //forgot password
    static get MISSING_RESET_CODE(){return "MISSING_RESET_CODE"}
    static get INVALID_RESET_CODE(){return "INVALID_RESET_CODE"}

    //user
    static get INVALID_NAME(){return "INVALID_NAME"}
    static get INVALID_PHONE(){return "INVALID_PHONE"}
    static get INVALID_GENDER(){return "INVALID_GENDER"}
    static get INVALID_BIRTHDAY(){return "INVALID_BIRTHDAY"}

    //server
    static get DATABASE_ERROR(){return "DATABASE_ERROR"}
    static get SERVER_ERROR(){return "SERVER_ERROR"}
    static get NOT_FOUND(){return "NOT_FOUND"}

    //require id
    static get MISSING_ID(){return "MISSING_ID"}

    //delete account
    static get ACCOUNT_PENDING_DELETE(){return "ACCOUNT_PENDING_DELETE"}
    static get EMAIL_PENDING_VERIFY(){return "EMAIL_PENDING_VERIFY"}

    //errorCode status and defaul message
    static errorCodes = {
        MISSING_EMAIL: { status: 400, message: "Email is required" },
        MISSING_PASSWORD: { status: 400, message: "Password is required" },
        PASSWORD_CONFIRM_INCORRECT: { status: 400, message: "Confirmed password not correct" },
        INVALID_EMAIL: { status: 400, message: "Email is Invalid" },
        EMAIL_ALREADY_EXISTS: { status: 409, message: "Email already exist" },
        FAILURE_SENT_MAIL: { status: 400, message: "Mail failure to sent" },
        EMAIL_ALREADY_VERIFY: { status: 400, message: "Email already verified" },
        EMAIL_NOT_FOUND: { status: 400, message: "Email not found in the system" },
        EMAIL_NOT_VERIFIED: { status: 400, message: "Email is not verified" },
        INCORRECT_PASSWORD: { status: 400, message: "Password is incorrect" },
        INVALID_NAME: { status: 400, message: "Name is invalid" },
        INVALID_GENDER: { status: 400, message: "Gender is invalid" },
        INVALID_PHONE: { status: 400, message: "Phone is invalid" },
        INVALID_BIRTHDAY: { status: 400, message: "Birthday is invalid" },
        UNAUTHORIZED: { status: 401, message: "UNAUTHORIZED" },
        MISSING_RESET_CODE: { status: 400, message: "ResetCode is required" },
        INVALID_RESET_CODE: { status: 400, message: "ResetCode is invalid" },
        DATABASE_ERROR: { status: 500, message: "Error in the database" },
        SERVER_ERROR: { status: 500, message: "Internal server error" },
        NOT_FOUND: { status: 500, message: "404 Not found" },
        MISSING_ID: {status: 400, message: "Id is missing"},
        USER_NOT_FOUND: {status: 400, message: "User not found"},
        INVALID_CODE: {status: 400, message: "Code is Invalid"},
        ACCOUNT_PENDING_DELETE: {status: 202, message: "Account is pending to delete"},
        EMAIL_PENDING_VERIFY: {status: 202, message: "Email is pending to verify"},
    }

    static getHttpStatus(errorCode){
        const errorInfo = ErrorCodeManager.errorCodes[errorCode]
        return errorInfo ? errorInfo.status : 500
    }

    static getErrorMessage(errorCode){
        const errorInfo = ErrorCodeManager.errorCodes[errorCode]
        return errorInfo ? errorInfo.message : 'Internal server error'
    }

    static isContainErrorCode(errorCode){
        return ErrorCodeManager.errorCodes[errorCode] ? true: false
    }
}

module.exports = ErrorCodeManager