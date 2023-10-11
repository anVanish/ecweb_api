const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const ErrorCodeManager = require('./ErrorCodeManager')

class InputValidator{}

InputValidator.validateEmail = (email)=>{
    return emailRegex.test(email)
}

InputValidator.invalidAuth = (auth) =>{
    if (!auth.email)
        return ErrorCodeManager.MISSING_EMAIL
    if (!auth.password)
        return ErrorCodeManager.MISSING_PASSWORD
    if (auth.confirmPassword && auth.password !== auth.confirmPassword)
        return ErrorCodeManager.PASSWORD_CONFIRM_INCORRECT
    if (!InputValidator.validateEmail(auth.email))
        return ErrorCodeManager.INVALID_EMAIL

    return null
}

module.exports = InputValidator