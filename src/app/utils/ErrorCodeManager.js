const CustomError = require('./CustomError')
class ErrorCodeManager{
    //ok
    static get EMAIL_PENDING_VERIFY(){ return new CustomError('EMAIL_PENDING_VERIFY', 202, "Email is pending to verify")}
        
    //bad request
    static get MISSING_EMAIL() {return new CustomError('MISSING_EMAIL', 400, "Email is required") }
    static get MISSING_PASSWORD() {return new CustomError(MISSING_PASSWORD, 400, "Password is required")}
    static get MISSING_ID(){ return new CustomError('MISSING_ID', 400, "Id is required")}
    static get MISSING_RESET_CODE() {return new CustomError('MISSING_RESET_CODE', 400, "ResetCode is required")}
    static get INVALID_EMAIL(){return new CustomError('INVALID_EMAIL', 400, "Email is invalid format")}
    static get INVALID_NAME() {return new CustomError('INVALID_NAME', 400, "Name is invalid format") }
    static get INVALID_GENDER() {return new CustomError('INVALID_GENDER', 400, "Gender is invalid format")}
    static get INVALID_PHONE() {return new CustomError('INVALID_PHONE', 400, "Phone is invalid format")}
    static get INVALID_BIRTHDAY() {return new CustomError('INVALID_BIRTHDAY', 400, "Birthday is invalid format")}
    static get INVALID_RESET_CODE() {return new CustomError('INVALID_RESET_CODE', 400, "ResetCode is invalid format") }
    static get INVALID_CODE() {return new CustomError('INVALID_CODE', 400, "Code is Invalid format")}
    static get INCORRECT_PASSWORD() {return new CustomError('INCORRECT_PASSWORD', 400, "Password is incorrect") }
    static get PASSWORD_CONFIRM_INCORRECT() {return new CustomError('PASSWORD_CONFIRM_INCORRECT', 400, "Confirmed password is not correct") }
    static get INVALID_ADDRESS() {return new CustomError('INVALID_ADDRESS', 400, "Address is Invalid")}
    static get ADDRESS_MUST_HAVE_DEFAULT() {return new CustomError('ADDRESS_MUST_HAVE_DEFAULT', 400, "Your addresses must have default address")}
    static get MISSING_CATEGORY_NAME() {return new CustomError('MISSING_CATEGORY_NAME', 400, "Category name is required")}
    static get MISSING_CATEGORY_IMAGE() {return new CustomError('MISSING_CATEGORY_IMAGE', 400, "Category image is required")}
    static get MISSING_PRODUCT_NAME() {return new CustomError('MISSING_PRODUCT_NAME', 400, "Product name is required")}
    static get MISSING_PRODUCT_IMAGE() {return new CustomError('MISSING_PRODUCT_IMAGE', 400, "Product image is required")}
    static get INVALID_PRODUCT_CATEGORY() {return new CustomError('INVALID_PRODUCT_CATEGORY', 400, "Categroy of product is invalid")}
    static get INVALID_PRODUCT_SUBCATEGORY() {return new CustomError('INVALID_PRODUCT_SUBCATEGORY', 400, "SubCategroy of product is invalid")}
    static get INVALID_PRODUCT_WIDTH() {return new CustomError('INVALID_PRODUCT_WIDTH', 400, "Product width is invalid, must be number and higher than 0")}
    static get INVALID_PRODUCT_HEIGHT() {return new CustomError('INVALID_PRODUCT_HEIGHT', 400, "Product height is invalid, must be number and higher than 0")}
    static get INVALID_PRODUCT_LENGTH() {return new CustomError('INVALID_PRODUCT_LENGTH', 400, "Product length is invalid, must be number and higher than 0")}
    static get MISSING_PRODUCT_VARIATION_NAME() {return new CustomError('MISSING_PRODUCT_VARIATION_NAME', 400, "Variation name is required")}
    static get INVALID_PRODUCT_VARIATIONS() {return new CustomError('INVALID_PRODUCT_VARIATIONS', 400, "Product must be at least 1 variation")}
    static get INVALID_PRODUCT_VARIATION_PRICE() {return new CustomError('INVALID_PRODUCT_VARIATION_PRICE', 400, "Product price is invalid, must be number and higher than 1000")}
    static get INVALID_PRODUCT_VARIATION_STOCK() {return new CustomError('INVALID_PRODUCT_VARIATION_STOCK', 400, "Product stock is invalid, must be number and higher than or equal 0")}
    static get INVALID_PARAMS_ID() {return new CustomError('INVALID_PARAMS_ID', 400, "Params id is invalid, format Mongodb ObjectId is required")}
    static get INVALID_SHOP_ID() {return new CustomError('INVALID_SHOP_ID', 400, "ShopId is invalid, id is required and format Mongodb ObjectId is required")}
    static get INVALID_CART_PRODUCT_ID() {return new CustomError('INVALID_CART_BODY', 400, "ProductId is invalid, id is required and format Mongodb ObjectId is required")}
    static get INVALID_CART_VARIATION_ID() {return new CustomError('INVALID_CART_BODY', 400, "VariationId is invalid, id is required and format Mongodb ObjectId is required")}
    static get MISSING_VARIATION_ID() {return new CustomError('MISSING_VARIATION_ID', 400, "Variation Id is required")}
    static get INVALID_UPDATED_CART_QUANTITY() {return new CustomError('INVALID_UPDATED_CART_QUANTITY', 400, "Quantity to update cart is invalid, required and must be number")}
    static get INVALID_CHECKOUT_PRODUCTS() {return new CustomError('INVALID_CHECKOUT_PRODUCTS', 400, "Checkout products body is invalid, require Mongodb Id for _id and variationId, quantity > 0")} 
    static get INVALID_ORDER() {return new CustomError('INVALID_ORDER', 400, "Order is invalid")}
    static get INVALID_ORDER_ADDRESS() {return new CustomError('INVALID_ORDER_ADDRESS', 400, "Order's address is missing or invalid")}
    static get INVALID_ORDER_SHOP() {return new CustomError('INVALID_ORDER_SHOP', 400, "Order's shop info is missing or invalid")}
    static get INVALID_ORDER_PRODUCT() {return new CustomError('INVALID_ORDER_PRODUCT', 400, "Order's product info is missing or invalid")}
    static get INVALID_ORDER_SHIPPING_COST() {return new CustomError('INVALID_ORDER_SHIPPING_COST', 400, "Order's shipping cost is missing or invalid")}
    static get INVALID_ORDER_TOTAL_PRICE() {return new CustomError('INVALID_ORDER_TOTAL_PRICE', 400, "Order's total priceis missing or invalid")}
    static get INVALID_ORDER_STATUS() {return new CustomError('INVALID_ORDER_STATUS', 400, "Order's status is invalid")}
    

    //unauthorized
    static get UNAUTHORIZED() {return new CustomError('UNAUTHORIZED', 401, "UNAUTHORIZED")}
    
    //forbidden
    static get ACCOUNT_PENDING_DELETE() {return new CustomError('ACCOUNT_PENDING_DELETE', 403, "Account is pending to delete")}
    static get EMAIL_NOT_VERIFIED() {return new CustomError('EMAIL_NOT_VERIFIED', 403, "Email require to verify")}
    static get ORDER_CANT_BE_CHANGED() {return new CustomError('ORDER_CANT_BE_CHANGED', 403, "Current order status does's allow to make change")}
    
    //not found
    static get EMAIL_NOT_FOUND() {return new CustomError('EMAIL_NOT_FOUND', 404, "Email not found") }
    static get USER_NOT_FOUND() {return new CustomError('USER_NOT_FOUND', 404, "User not found")}
    static get NOT_FOUND() {return new CustomError('NOT_FOUND', 404, "404 Not found") }
    static get ADDRESS_NOT_FOUND() {return new CustomError('ADDRESS_NOT_FOUND', 404, "Address not found") }
    static get SHOP_NOT_FOUND() {return new CustomError('SHOP_NOT_FOUND', 404, "Shop not found") }
    static get CATEGORY_NOT_FOUND() {return new CustomError('CATEGORY_NOT_FOUND', 404, "Category not found") }
    static get PRODUCT_NOT_FOUND() {return new CustomError('PRODUCT_NOT_FOUND', 404, "Product not found") }
    static get VARIATION_NOT_FOUND() {return new CustomError('VARIATION_NOT_FOUND', 404, "Product's variation not found") }
    static get CART_NOT_FOUND() {return new CustomError('CART_NOT_FOUND', 404, "Cart not found") }
    static get CART_ITEM_NOT_FOUND() {return new CustomError('CART_ITEM_NOT_FOUND', 404, "Cart item not found") }
    static get ORDER_NOT_FOUND() {return new CustomError('ORDER_NOT_FOUND', 404, "Order not found") }

    //conflict
    static get EMAIL_ALREADY_EXISTS() {return new CustomError('EMAIL_ALREADY_EXISTS', 409, "Email already exist") }

    //internal server error
    static get FAILURE_SENT_MAIL() {return new CustomError('FAILURE_SENT_MAIL', 500, "Mail failure to sent") }
    static get DATABASE_ERROR() {return new CustomError('DATABASE_ERROR', 500, "Error in the database") }
    static get SERVER_ERROR() {return new CustomError('SERVER_ERROR', 500, "Internal server error") }
}

module.exports = ErrorCodeManager