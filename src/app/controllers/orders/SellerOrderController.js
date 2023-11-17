const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require('../../utils/InputValidator')
const ApiResponse = require('../../utils/ApiResponse')
const Orders = require('../../models/Orders')
const Shops = require('../../models/Shops')
const { filterOrders } = require("../../utils/SearchFilters")

class OrderController{
    //GET /api/orders/shop
    async listShopOrders(req, res, next){
        const sellerId = req.user._id

        try {
            const shop = await Shops.findOne({sellerId})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const {filters, pagination, sort} = filterOrders(req.query, {'shop._id': shop._id})
            const orders = await Orders.find(filters)
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit)
                .sort(sort)
            
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.count = await Orders.countDocuments(filters)
            apiResponse.data.length = orders.length
            apiResponse.data.orders = orders
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //GET /api/orders/:orderId/me
    async detailShopOrder(req, res, next){
        const sellerId = req.user._id
        const _id = req.params.orderId
        try {
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID

            const shop = await Shops.findOne({sellerId})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const order = await Orders.findOne({'shop._id': shop._id, _id})
            if (!order) throw ErrorCodeManager.ORDER_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.order = order
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //PATCH /api/orders/:orderId/confirm 
    async confirmShopOrder(req, res, next){
        const sellerId = req.user._id
        const _id = req.params.orderId
        try {
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID

            const shop = await Shops.findOne({sellerId})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const order = await Orders.findOne({'shop._id': shop._id, _id})
            if (!order) throw ErrorCodeManager.ORDER_NOT_FOUND

            if (!['to-pay', 'to-confirm'].includes(order.status)) throw ErrorCodeManager.ORDER_CANT_BE_CHANGED

            
            order.status = 'to-ship'
            order.statusHistory.push({
                status: order.status
            })
            await order.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Order updated')
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //DELETE /api/orders/:orderId/me 
    async cancelShopOrder(req, res, next){
        const sellerId = req.user._id
        const _id = req.params.orderId
        try {
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID

            const shop = await Shops.findOne({sellerId})
            if (!shop) throw ErrorCodeManager.SHOP_NOT_FOUND

            const order = await Orders.findOne({'shop._id': shop._id, _id})
            if (!order) throw ErrorCodeManager.ORDER_NOT_FOUND

            if (!['to-pay', 'to-confirm'].includes(order.status)) throw ErrorCodeManager.ORDER_CANT_BE_CHANGED
            
            order.status = 'canceled'
            order.statusHistory.push({
                status: order.status
            })
            await order.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Order updated')
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }
}

module.exports = new OrderController()