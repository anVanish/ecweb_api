const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require('../../utils/InputValidator')
const ApiResponse = require('../../utils/ApiResponse')
const Orders = require('../../models/Orders')
const Products = require('../../models/Product')
const Shops = require('../../models/Shops')
const Users = require('../../models/Users')
const tokenSerice = require('../../services/TokenService')
const ProductOrder = require('../../utils/responses/ProductOrder')
const { filterOrders } = require("../../utils/SearchFilters")
const Carts = require("../../models/Carts")

class OrderController{
    //GET /api/orders/me
    async listMyOrders(req, res, next){
        const userId = req.user._id
        const {pagination, sort, filters} = filterOrders(req.query, {userId})
        try{
            const orders = await Orders.find(filters)
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit)
                .sort(sort)
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.total = await Orders.countDocuments(filters)
            apiResponse.data.length = orders.length
            apiResponse.data.orders = orders
            res.json(apiResponse)
        }
        catch(error){
            next(error)
        }
    }

    //GET /api/orders/:orderId/me
    async detailMyOrder(req, res, next){
        const userId = req.user._id
        try{
            const _id = req.params.orderId
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID

            const order = await Orders.findOne({_id, userId})
            if (!order) throw ErrorCodeManager.ORDER_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.order = order
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //GET /api/orders/checkout?code
    async checkout(req, res, next){
        const userId = req.user._id
        const code = req.query.code

        try{
            const user = await Users.findOneUsers({_id: userId})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND

            const decoded = tokenSerice.decodeToken(code)
            if (!decoded) throw ErrorCodeManager.INVALID_CODE
            const products = decoded.data

            const shopMaps = await getShopProductsMap(products)
            const {orders, total} = await getOrders(shopMaps)

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.orders = orders
            apiResponse.data.total = total
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //POST /api/odrers/checkout/code
    async getCheckOutCode(req, res, next){
        const products = req.body.products
        try{
            for (const product of products){
                if (!InputValidator.validateId(product._id) || !InputValidator.validateId(product.variationId) || typeof product.quantity !== 'number' || product.quantity <= 0) throw ErrorCodeManager.INVALID_CHECKOUT_PRODUCTS
            }

            const code = tokenSerice.generateToken(products, '30m')

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.code = code

            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //POST /api/orders/me
    async addMyOrder(req, res, next){
        const orders = req.body.orders
        const addressId = req.body.addressId
        const userId = req.user._id
        try {
            if (!orders || !Array.isArray(orders) || orders.length <= 0) throw ErrorCodeManager.INVALID_ORDER
            

            const user = await Users.findOne({_id: userId})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
            const address = user.addresses.id(addressId)
            if (!address) throw ErrorCodeManager.ADDRESS_NOT_FOUND

            const orderAddr = address.toObject()
            orderAddr._id = orderAddr._id.toString()
            
            for (const orderItem of orders){
                orderItem.address = orderAddr
                const error = InputValidator.invalidOrder(orderItem)
                if (error) throw error

                const order = new Orders(orderItem)
                order.status = 'to-confirm'
                order.statusHistory.push({
                    status: order.status
                })
                order.userId = userId
                await order.save()
            }

            //delete from carts when order successfully
            const cartIdsToDelete = orders.flatMap(order => order.products.map(product => ({
                userId: userId,
                productId: product._id,
                variationId: product.variation._id
            })))
            await Carts.deleteMany({$or:cartIdsToDelete})


            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Order Successfully')
            apiResponse.data.test = cartIdsToDelete
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
        
    }

    //PATCH /api/orders/:orderId/me/address
    async updateMyOrder(req, res, next){
        const userId = req.user._id
        const _id = req.params.orderId
        const addressId = req.body.addressId
        try{
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.ORDER_NOT_FOUND
            if (!InputValidator.validateId(addressId)) throw ErrorCodeManager.INVALID_PARAMS_ID
            const user = await Users.findOneUsers({_id: userId})
            if (!user) throw ErrorCodeManager.USER_NOT_FOUND
        
            const address = user.addresses.id(addressId)
            if (!address) throw ErrorCodeManager.ADDRESS_NOT_FOUND

            const order = await Orders.findOne({_id, userId})   
            if (!order) throw ErrorCodeManager.ORDER_NOT_FOUND
            if (!['to-pay', 'to-confirm'].includes(order.status)) throw ErrorCodeManager.ORDER_CANT_BE_CHANGED


            order.address = address
            await order.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Order\'s address updated')
            res.json(apiResponse)
        } catch (error) {
            next(error)
        }
    }

    //DELETE /api/orders/:orderId/me 
    async cancelMyOrder(req, res, next){
        const userId = req.user._id
        const _id = req.params.orderId

        try {
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID
            const order = await Orders.findOne({_id, userId})
            if (!order) throw ErrorCodeManager.ORDER_NOT_FOUND
            if (!['to-pay', 'to-confirm'].includes(order.status)) throw ErrorCodeManager.ORDER_CANT_BE_CHANGED


            order.status = 'canceled'
            order.statusHistory.push({
                status: order.status
            })
            await order.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Order canceled')
            res.json(apiResponse)
        } catch (error) {
            next(error)
        }
    }

}

async function getShopProductsMap(products){
    const shopMaps = new Map()
    for(const productInfo of products){
        const {_id, variationId, quantity} = productInfo
        
        const product = await Products.findOne({_id})
        if (!product) throw ErrorCodeManager.PRODUCT_NOT_FOUND
        
        const shopId = product.shopId.toString()
        if (!shopMaps.has(shopId)) shopMaps.set(shopId, [])

        const productOrder = new ProductOrder(product, variationId, quantity)
        if (!productOrder.variation) throw ErrorCodeManager.VARIATION_NOT_FOUND

        shopMaps.get(shopId).push({productOrder})
    }
    return shopMaps
}

async function getOrders(shopMaps){
    const orders = []
    let total = 0
    for (const [shopId, productOrders] of shopMaps){
        const order = {
            products: [],
            shippingCost: 20000,
            totalPrice: 0,
        }

        for (const product of productOrders){
            order.products.push(product.productOrder)
            order.totalPrice += product.productOrder.variation.price * product.productOrder.quantity
        }

        order.totalPrice += order.shippingCost
        const shop = await Shops.findOne({_id: shopId})
        if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

        order.shop = {_id: shop._id, name: shop.name}

        total += order.totalPrice
        orders.push(order)
    }
    return {orders, total}
}

module.exports = new OrderController()