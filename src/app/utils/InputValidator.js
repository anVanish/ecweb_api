const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const nameRegex = /^[\p{L}\p{M}\s.'-]+$/u
const phoneRegex = /^0\d{9}$/
const genderRegex = /^(male|female)?$/i
const birthdayRegex = /^(\d{4})-(\d{2})-(\d{2})$/

const ErrorCodeManager = require('./ErrorCodeManager')

class InputValidator{}  

InputValidator.validateEmail = (email)=>{
    return emailRegex.test(email)
}

InputValidator.validateName = (name) => {
    return nameRegex.test(name)
}

InputValidator.validateBirthDay = (birthDay) => {
    if (!birthdayRegex.test(birthDay)) return false

    const parts = birthDay.split('-')
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const day = parseInt(parts[2], 10)
    const birthDate = new Date(year, month - 1, day)

    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear()

    if (age > 200 || birthDate > currentDate) return false
    return true
}

InputValidator.validatePhone = (phone) => {
    return phoneRegex.test(phone)
}

//general
InputValidator.validateGender = (gender) => {
    return genderRegex.test(gender)
}

InputValidator.invalidAuth = (auth) =>{
    if (!auth.email)
        return ErrorCodeManager.MISSING_EMAIL
    if (!InputValidator.validateEmail(auth.email))
        return ErrorCodeManager.INVALID_EMAIL
    if (!auth.password)
        return ErrorCodeManager.MISSING_PASSWORD
    if (auth.confirmPassword && auth.password !== auth.confirmPassword)
        return ErrorCodeManager.PASSWORD_CONFIRM_INCORRECT
    return null
}

InputValidator.invalidUser = (user) => {
    if (user.name && !InputValidator.validateName(user.name)) return ErrorCodeManager.INVALID_NAME
    if (user.phone && !InputValidator.validatePhone(user.phone)) return ErrorCodeManager.INVALID_PHONE
    if (user.gender && !InputValidator.validateGender(user.gender)) return ErrorCodeManager.INVALID_GENDER
    if (user.birthday && !InputValidator.validateBirthDay(user.birthday)) return ErrorCodeManager.INVALID_BIRTHDAY
    return null
}

InputValidator.invalidAddr = (addr) => {
    if (!addr.name || !InputValidator.validateName(addr.name)) return ErrorCodeManager.INVALID_NAME
    if (!addr.phone || !InputValidator.validatePhone(addr.phone)) return ErrorCodeManager.INVALID_PHONE
    if (!addr.city || !addr.district || !addr.ward || !addr.detail) return ErrorCodeManager.INVALID_ADDRESS

    return null
}



module.exports = InputValidator