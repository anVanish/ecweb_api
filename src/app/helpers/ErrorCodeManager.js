
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

    //database
    static get DATABASE_ERROR(){return "DATABASE_ERROR"}
    static get UNKNOWN_ERROR(){return "UNKNOWN_ERROR"}
}

module.exports = ErrorCodeManager