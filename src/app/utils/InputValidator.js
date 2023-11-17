const joi = require('joi')
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
const nameRegex = /^[\p{L}\p{M}\s.'-]+$/u
const phoneRegex = /^0\d{9}$/
const genderRegex = /^(male|female)?$/i
const birthdayRegex = /^(\d{4})-(\d{2})-(\d{2})$/
const objectIdRegex = /^[0-9a-fA-F]{24}$/
const ErrorCodeManager = require('./ErrorCodeManager')

const variationSchema = joi.object({
    name: joi.string().required(),
    price: joi.number().required().min(1000),
    stock: joi.number().required().min(0),
});
const productJoi = joi.object({
    shopId: joi.string().hex().length(24).required(),
    name: joi.string().required(),
    images: joi.array().items(joi.string()).min(1).required(),
    category: joi.object({
        categorySlug: joi.string().required(),
        subCategorySlug: joi.string().required(),
    }).required(),
    variations: joi.array().items(variationSchema).min(1).required(),
    weight: joi.number().min(1).required(), 
    packageSize: joi.object({
        width: joi.number().min(1).required(), 
        length: joi.number().min(1).required(),
        height: joi.number().min(1).required(),
    }).required(),
}).options({ allowUnknown: true })

const orderJoi = joi.object({
    address: joi.object({
        _id: joi.string().hex().length(24).required(),
        name: joi.string().required(),
        phone: joi.string().required(),
        city: joi.string().required(),
        district: joi.string().required(),
        ward: joi.string().required(),
        detail: joi.string().required(),
    }).required(),
    shop: joi.object({
        _id: joi.string().hex().length(24).required(),
        name: joi.string().required(),
    }).required(),
    products: joi.array().items(joi.object({
        _id: joi.string().hex().length(24).required(),
        name: joi.string().required(),
        slug: joi.string().required(),
        variation: joi.object({
            _id: joi.string().hex().length(24).required(),
            name: joi.string().required(),
            price: joi.number().min(1000).required(),
        }),
        quantity: joi.number().min(1).required(),
    })).required(),
    shippingCost: joi.number().min(0).required(),
    totalPrice: joi.number().min(0).required(),
})

class InputValidator{}  
InputValidator.validateId = (id) => {
    return objectIdRegex.test(id)
}
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
InputValidator.validateGender = (gender) => {
    return genderRegex.test(gender)
}

//general
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
    if (!addr) return ErrorCodeManager.INVALID_ADDRESS
    if (!addr.name || !InputValidator.validateName(addr.name)) return ErrorCodeManager.INVALID_NAME
    if (!addr.phone || !InputValidator.validatePhone(addr.phone)) return ErrorCodeManager.INVALID_PHONE
    if (!addr.city || !addr.district || !addr.ward || !addr.detail) return ErrorCodeManager.INVALID_ADDRESS

    return null
}
InputValidator.invalidShop = (shop, {create=true} = {}) => {
    if (create)
    {
        if (!shop.name) return ErrorCodeManager.INVALID_NAME
        if (!shop.sellerId) return ErrorCodeManager.MISSING_ID
        if (!shop.address || InputValidator.invalidAddr(shop.address)) return ErrorCodeManager.INVALID_ADDRESS
    }
    else {
        if (shop.address && InputValidator.invalidAddr(shop.address)) return ErrorCodeManager.INVALID_ADDRESS
    }
    return null
}
InputValidator.invalidCate = (category) => {
    if (!category) return ErrorCodeManager.MISSING_CATEGORY_NAME
    if (!category.name) return ErrorCodeManager.MISSING_CATEGORY_NAME
    if (!category.image) return ErrorCodeManager.MISSING_CATEGORY_IMAGE

    return null
}
InputValidator.invalidProduct = (product) => {
    if (!product) return ErrorCodeManager.MISSING_PRODUCT_NAME
    
    const result = productJoi.validate(product)
    if (!result.error) return null
    
    const paths = result.error.details[0].path
    const path = paths[paths.length - 1]

    if (path === 'shopId') return ErrorCodeManager.INVALID_SHOP_ID
    if (path === 'name' && !paths.includes('variations')) return ErrorCodeManager.MISSING_PRODUCT_NAME
    if (path === 'images') return ErrorCodeManager.MISSING_PRODUCT_IMAGE
    if (path === 'category' || path === 'categorySlug' || path === 'subCategorySlug') return ErrorCodeManager.INVALID_PRODUCT_CATEGORY
    if (path === 'variations') return ErrorCodeManager.INVALID_PRODUCT_VARIATIONS
    if (path === 'name') return ErrorCodeManager.MISSING_PRODUCT_VARIATION_NAME
    if (path === 'price') return ErrorCodeManager.INVALID_PRODUCT_VARIATION_PRICE
    if (path === 'stock') return ErrorCodeManager.INVALID_PRODUCT_VARIATION_STOCK
    if (path === 'weight') return ErrorCodeManager.INVALID_PRODUCT_WEIGHT
    if (path === 'packageSize' || path === 'width') return ErrorCodeManager.INVALID_PRODUCT_WIDTH
    if (path === 'length') return ErrorCodeManager.INVALID_PRODUCT_LENGTH
    if (path === 'height') return ErrorCodeManager.INVALID_PRODUCT_HEIGHT

    return null
}

InputValidator.invalidCartItem = (cart) => {
    if (!InputValidator.validateId(cart.productId)) return ErrorCodeManager.INVALID_CART_PRODUCT_ID
    if (!InputValidator.validateId(cart.variationId)) return ErrorCodeManager.INVALID_CART_VARIATION_ID
    return null
}

InputValidator.invalidOrder = (order) => {
    if (!order) return ErrorCodeManager.INVALID_ORDER
    const result = orderJoi.validate(order)
    if (!result.error) return null
    
    const paths = result.error.details[0].path
    const path = paths[paths.length - 1]
    console.log(result.error.details)

    if (paths.includes('address')) return ErrorCodeManager.INVALID_ORDER_ADDRESS
    if (paths.includes('shop')) return ErrorCodeManager.INVALID_ORDER_SHOP
    if (paths.includes('products')) return ErrorCodeManager.INVALID_ORDER_PRODUCT
    if (path === 'shippingCost') return ErrorCodeManager.INVALID_ORDER_SHIPPING_COST
    if (path === 'totalPrice') return ErrorCodeManager.INVALID_ORDER_TOTAL_PRICE

    return null
}

module.exports = InputValidator