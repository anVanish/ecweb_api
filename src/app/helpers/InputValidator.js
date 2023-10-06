const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const ErrorCodeManager = require('./ErrorCodeManager')

class InputValidator{}

InputValidator.validateEmail = (email)=>{
    return emailRegex.test(email)
}

InputValidator.invalidAuth = (auth) =>{
    if (!auth.email) {
        return {
            message: 'Email is required', 
            errorCode: ErrorCodeManager.MISSING_EMAIL
        }
    }
    if (!auth.password) {
        return {
            message: 'Password is required', 
            errorCode: ErrorCodeManager.MISSING_PASSWORD
        }
    }
    if (auth.confirmPassword && auth.password !== auth.confirmPassword) {
        return {
            message: 'Confirm password is not correct', 
            errorCode: ErrorCodeManager.PASSWORD_CONFIRM_INCORRECT
        }
    }
    if (!InputValidator.validateEmail(auth.email)) {
        return {
            message: 'Invalid email format', 
            errorCode: ErrorCodeManager.INVALID_EMAIL
        }
    }

    return null
}

module.exports = InputValidator