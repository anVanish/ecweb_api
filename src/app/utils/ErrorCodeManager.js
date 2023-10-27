
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

    //addr
    static get INVALID_ADDRESS(){return 'INVALID_ADDRESS'}
    static get ADDRESS_NOT_FOUND(){return 'ADDRESS_NOT_FOUND'}

    //shop
    static get SHOP_NOT_FOUND(){return 'SHOP_NOT_FOUND'}

    //category
    static get MISSING_CATEGORY_NAME(){return 'MISSING_CATEGORY_NAME'}
    static get MISSING_CATEGORY_IMAGE(){return 'MISSING_CATEGORY_IMAGE'}
    static get CATEGORY_NOT_FOUND(){return 'CATEGORY_NOT_FOUND'}

    //errorCode status and defaul message
    static errorCodes = {
        //ok
        EMAIL_PENDING_VERIFY: {status: 202, message: "Email is pending to verify"},
        
        //bad request
        MISSING_EMAIL: { status: 400, message: "Email is required" },
        MISSING_PASSWORD: { status: 400, message: "Password is required" },
        MISSING_ID: {status: 400, message: "Id is required"},
        MISSING_RESET_CODE: { status: 400, message: "ResetCode is required" },
        INVALID_EMAIL: { status: 400, message: "Email is invalid format" },
        INVALID_NAME: { status: 400, message: "Name is invalid format" },
        INVALID_GENDER: { status: 400, message: "Gender is invalid format" },
        INVALID_PHONE: { status: 400, message: "Phone is invalid format" },
        INVALID_BIRTHDAY: { status: 400, message: "Birthday is invalid format" },
        INVALID_RESET_CODE: { status: 400, message: "ResetCode is invalid format" },
        INVALID_CODE: {status: 400, message: "Code is Invalid format"},
        INCORRECT_PASSWORD: { status: 400, message: "Password is incorrect" },
        PASSWORD_CONFIRM_INCORRECT: { status: 400, message: "Confirmed password is not correct" },
        INVALID_ADDRESS: {status: 400, message: "Address is Invalid"},
        MISSING_CATEGORY_NAME: {status: 400, message: "Category name is required"},
        MISSING_CATEGORY_IMAGE: {status: 400, message: "Categroy image is required"},
        
        //unauthorized
        UNAUTHORIZED: { status: 401, message: "UNAUTHORIZED" },
        
        //forbidden
        ACCOUNT_PENDING_DELETE: {status: 403, message: "Account is pending to delete"},
        EMAIL_NOT_VERIFIED: {status: 403, message: "Email require to verify"},
        
        //not found
        EMAIL_NOT_FOUND: { status: 404, message: "Email not found" },
        USER_NOT_FOUND: {status: 404, message: "User not found"},
        NOT_FOUND: { status: 404, message: "404 Not found" },
        ADDRESS_NOT_FOUND: { status: 404, message: "Address not found" },
        SHOP_NOT_FOUND: { status: 404, message: "Shop not found" },
        CATEGORY_NOT_FOUND: { status: 404, message: "Category not found" },
        
        //conflict
        EMAIL_ALREADY_EXISTS: { status: 409, message: "Email already exist" },

        //internal server error
        FAILURE_SENT_MAIL: { status: 500, message: "Mail failure to sent" },
        DATABASE_ERROR: { status: 500, message: "Error in the database" },
        SERVER_ERROR: { status: 500, message: "Internal server error" },
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