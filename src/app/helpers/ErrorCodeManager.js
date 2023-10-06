
class ErrorCodeManager{
    //register
    static get MISSING_EMAIL(){ return "MISSING_EMAIL"}
    static get MISSING_PASSWORD(){ return "MISSING_PASSWORD"}
    static get PASSWORD_CONFIRM_INCORRECT(){ return "PASSWORD_CONFIRM_INCORRECT"}
    static get INVALID_EMAIL(){ return "INVALID_EMAIL"}
    static get EMAIL_ALREADY_EXISTS(){ return "EMAIL_ALREADY_EXISTS"}
    static get FAILURE_SENT_MAIL(){return "FAILURE_SENT_MAIL"}

    //verify email
    static get NOT_FOUND_VERIFY_INFO(){return "NOT_FOUND_VERIFY_INFO"}
    static get USER_NOT_FOUND(){return "USER_NOT_FOUND"}
    static get CODE_EXPIRED(){return "CODE_EXPIRED"}
    static get INCORRECT_CODE(){return "INCORRECT_CODE"}

    //login
    static get EMAIL_NOT_FOUND(){return "EMAIL_NOT_FOUND"}
    static get EMAIL_NOT_VERIFIED(){return "EMAIL_NOT_VERIFIED"}
    static get INCORRECT_PASSWORD(){return "INCORRECT_PASSWORD"}
    

    static get DATABASE_ERROR(){return "DATABASE_ERROR"}
}

module.exports = ErrorCodeManager