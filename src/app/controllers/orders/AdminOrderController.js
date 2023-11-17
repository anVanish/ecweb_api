const ErrorCodeManager = require("../../utils/ErrorCodeManager")
const InputValidator = require('../../utils/InputValidator')
const ApiResponse = require('../../utils/ApiResponse')
const Orders = require('../../models/Orders')
const {filterOrders} = require('../../utils/SearchFilters')

class OrderController{
    //GET /api/orders
    async listOrders(req, res, next){
        const {pagination, sort, filters} = filterOrders(req.query)
        try {
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

    //GET /api/orders/:orderId
    async detailOrder(req, res, next){
        const _id = req.params.orderId

        try {
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID

            const order = await Orders.findOne({_id})
            if (!order) throw ErrorCodeManager.ORDER_NOT_FOUND

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('')
            apiResponse.data.order = order
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }

    //POST /api/orders
    async addOrder(req, res, next){
        res.json('hello')
    }

    //PATCH /api/orders/:orderId/status
    async updateOrderStatus(req, res, next){
        const _id = req.params.orderId
        const status = req.body.status
        const availableStatuses = ['to-pay', 'to-confirm', 'to-ship', 'to-receive', 'completed', 'canceled']
        
        try{
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID
            const order = await Orders.findOne({_id})
            if (!order) throw ErrorCodeManager.ORDER_NOT_FOUND
            if (!availableStatuses.includes(status)) throw ErrorCodeManager.INVALID_ORDER_STATUS

            if (order.status != status){
                order.status = status
                order.statusHistory.push({
                    status: order.status
                })
                await order.save()
            }

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Order status updated')
            res.json(apiResponse)
        }catch(error){
            next(error)
        }
    }

    //PATCH /api/orders/:orderId/address
    async updateOrderAddress(req, res, next){
        const _id = req.params.orderId
        const address = req.body.address

        try {
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID
            const error = InputValidator.invalidAddr(address)
            if (error) throw error

            const order = await Orders.findOne({_id})
            if (!order) throw ErrorCodeManager.ORDER_NOT_FOUND

            order.address = address
            await order.save()

            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Order address updated')
            res.json(apiResponse)
        } catch (error) {
            next(error)
        }
    }

    //DELETE /api/orders/:orderId 
    async cancelOrder(req, res, next){
        const _id = req.params.orderId

        try {
            if (!InputValidator.validateId(_id)) throw ErrorCodeManager.INVALID_PARAMS_ID

            const order = await Orders.findOne({_id})
            if (!order) throw ErrorCodeManager.ORDER_NOT_FOUND

            if (order.status !== 'canceled'){
                order.status = 'canceled'
                order.statusHistory.push({status: order.status})
            }

            await order.save()
            const apiResponse = new ApiResponse()
            apiResponse.setSuccess('Order canceled')
            res.json(apiResponse)
        } catch(error) {
            next(error)
        }
    }
}

module.exports = new OrderController()