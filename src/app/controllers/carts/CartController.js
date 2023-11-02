const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require('../../utils/InputValidator')
const ApiResponse = require('../../utils/ApiResponse')
const Products = require('../../models/Product')
const Shops = require('../../models/Shops')
const Carts = require('../../models/Carts')

class CartController{
    //GET /api/carts
    async listCarts(req, res, next){
        const _id = req.user._id
        try{
            let cart = await Carts.findOne({userId: _id})
            if (!cart){
                cart = new Carts({userId: _id})
                await cart.save()
            }
            else{
                await cart.populate({
                    path: 'items.productId',
                    select: '_id slug images name'
                })
            }
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.cart = cart
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //POST /api/carts
    async addToCarts(req, res, next){
        const userId = req.user._id
        try{
            const error = InputValidator.invalidCartItem(req.body)
            if (error) throw error

            //get product info
            const product = await Products.findOne({_id: req.body.productId})
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND
            const variationProduct = product.variations.id(req.body.variationId)
            if (!variationProduct) throw ErrorCodeManager.VARIATION_NOT_FOUND
            
            //get cart info
            const cart = await Carts.findOne({userId})
            //create cart if not found
            if (!cart) cart = new Carts({userId})

            const cartItem = cart.items.find((item) => item.productId.toString() === req.body.productId)

            if (cartItem) {
                cartItem.quantity += 1
                cartItem.totalPrice = variationProduct.price * cartItem.quantity
            }
            else{
                req.body.totalPrice = variationProduct.price
                req.body.variation = variationProduct
                cart.items.push(req.body)
            }
            await cart.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Cart added')
            apiResponse.data.cart = cart
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //PATCH /api/carts/:cartItemId/variation
    async updateCartVariation(req, res, next){
        const userId = req.user._id
        const cartItemId = req.params.cartItemId
        const variationId = req.body.variationId

        try{
            if (!InputValidator.validateId(cartItemId)) throw ErrorCodeManager.INVALID_PARAMS_ID
            if (!variationId) throw ErrorCodeManager.MISSING_VARIATION_ID
            const cart = await Carts.findOne({userId})
            if (!cart) throw ErrorCodeManager.CART_NOT_FOUND

            const cartItem = cart.items.id(cartItemId)
            if (!cartItem) throw ErrorCodeManager.CART_ITEM_NOT_FOUND

            const product = await Products.findOne({_id: cartItem.productId})
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND

            const variation = product.variations.id(variationId)
            if (!variation) throw ErrorCodeManager.VARIATION_NOT_FOUND

            cartItem.variation = variation
            await cart.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Cart variation updated')
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //PATCH /api/carts/:cartItemId/quantity
    async updateCartQuantity(req, res, next){
        const userId = req.user._id
        const cartItemId = req.params.cartItemId
        const quantityBody = req.body.quantity

        try{
            if (!InputValidator.validateId(cartItemId)) throw ErrorCodeManager.INVALID_PARAMS_ID
            if (typeof quantityBody !== 'number') throw ErrorCodeManager.INVALID_UPDATED_CART_QUANTITY
            
            const cart = await Carts.findOne({userId})
            if (!cart) throw ErrorCodeManager.CART_NOT_FOUND

            const cartItem = cart.items.id(cartItemId)
            if (!cartItem) throw ErrorCodeManager.CART_ITEM_NOT_FOUND

            const quantity = parseInt(quantityBody)
            
            if (quantity <= 0){
                //delete from cart
                cart.items = cart.items.filter((item) => item._id != cartItem._id)
            } else {
                const product = await Products.findOne({_id: cartItem.productId})
                if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND

                const variation = product.variations.id(cartItem.variation._id)
                if (!variation) throw ErrorCodeManager.VARIATION_NOT_FOUND 

                cartItem.quantity = quantity
                cartItem.totalPrice = quantity * variation.price
            }

            await cart.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Cart quantity updated')
            apiResponse.data.cart = cart
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }
    
    //DELETE /api/carts/:cartItemId
    async deleteFromCarts(req, res, next){
        const cartItemId = req.params.cartItemId
        const userId = req.user._id
        try{
            if (!InputValidator.validateId(cartItemId)) ErrorCodeManager.INVALID_PARAMS_ID

            const cart = await Carts.findOne({userId})
            if (!cart) throw ErrorCodeManager.CART_NOT_FOUND
            
            const cartItem = cart.items.id(cartItemId)
            if (!cartItem) throw ErrorCodeManager.CART_ITEM_NOT_FOUND

            cart.items = cart.items.filter((item) => item._id !== cartItem._id)
            
            await cart.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('cart deleted')
            apiResponse.data.cart = cart

            res.json(apiResponse)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CartController()