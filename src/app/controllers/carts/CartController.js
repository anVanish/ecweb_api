const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require('../../utils/InputValidator')
const ApiResponse = require('../../utils/ApiResponse')
const Products = require('../../models/Product')
const Shops = require('../../models/Shops')
const Carts = require('../../models/Carts')

class CartController{
    //GET /api/carts
    async listCarts(req, res, next){
        const userId = req.user._id
        
        try{
            const carts = await Carts.findCarts({userId})
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.total = await Carts.countDocuments({userId})
            apiResponse.data.carts = carts
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

            const {productId, variationId} = req.body

            //get product info
            const product = await Products.findOne({_id: productId})
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND
            const variationProduct = product.variations.id(variationId)
            if (!variationProduct) throw ErrorCodeManager.VARIATION_NOT_FOUND
            
            let cart = await Carts.findOne({productId, variationId, userId})
            if (cart) {
                cart.quantity += 1
                cart.totalPrice = variationProduct.price * cart.quantity
            }
            else{
                cart = new Carts({productId, variationId, userId, totalPrice: variationProduct.price})
            }
            await cart.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Product added to cart')
            apiResponse.data.cart = cart 
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //PATCH /api/carts/:cartId/variation
    async updateCartVariation(req, res, next){
        const _id = req.params.cartId
        const userId = req.user._id
        const variationId = req.body.variationId

        try{
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID
            if (!InputValidator.validateId(variationId)) throw ErrorCodeManager.INVALID_CART_VARIATION_ID
            
            //get cart to update
            const cart = await Carts.findOne({_id, userId})
            if (!cart) throw ErrorCodeManager.CART_NOT_FOUND

            const product = await Products.findOne({_id: cart.productId})
            if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND

            const variationProduct = product.variations.id(variationId)
            if (!variationProduct) throw ErrorCodeManager.VARIATION_NOT_FOUND

            //count all cart have that variation
            const existCart = await Carts.findOne({productId: cart.productId, variationId: req.body.variationId, _id: {$ne: _id}})

            //not found same variation, update
            if (!existCart){
                if (cart.variationId != req.body.variationId){
                    cart.variationId = req.body.variationId
                    await cart.save()
                }
            }
            //found, delete current and update quantiy to existing cart
            else{
                existCart.quantity += 1
                existCart.totalPrice = existCart.quantity * variationProduct.price
                await existCart.save()
                await cart.deleteOne()
            }
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Cart variation updated')
            apiResponse.data.variation = variationProduct
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //PATCH /api/carts/:cartId/quantity
    async updateCartQuantity(req, res, next){
        const userId = req.user._id
        const cartId = req.params.cartId
        const quantityBody = req.body.quantity

        try{
            if (!InputValidator.validateId(cartId)) throw ErrorCodeManager.INVALID_PARAMS_ID
            if (typeof quantityBody !== 'number') throw ErrorCodeManager.INVALID_UPDATED_CART_QUANTITY
            
            const cart = await Carts.findOne({_id: cartId, userId})
            if (!cart) throw ErrorCodeManager.CART_NOT_FOUND

            const quantity = parseInt(quantityBody)
            
            if (quantity <= 0){
                await cart.deleteOne()
            } else {
                const product = await Products.findOne({_id: cart.productId})
                if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND

                const variation = product.variations.id(cart.variationId)
                if (!variation) throw ErrorCodeManager.VARIATION_NOT_FOUND 

                cart.quantity = quantity
                cart.totalPrice = quantity * variation.price
                await cart.save()
            }
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Cart quantity updated')
            apiResponse.data.cart = cart
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }
    
    //DELETE /api/carts/:cartId
    async deleteFromCarts(req, res, next){
        const cartId = req.params.cartId
        const userId = req.user._id
        try{
            if (!InputValidator.validateId(cartId)) ErrorCodeManager.INVALID_PARAMS_ID

            const cart = await Carts.findOne({_id: cartId, userId})
            if (!cart) throw ErrorCodeManager.CART_NOT_FOUND
            
            await cart.deleteOne()
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Cart deleted')
            res.json(apiResponse)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CartController()