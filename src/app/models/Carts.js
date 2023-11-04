const mongoose = require('mongoose')
const InputValidator = require('../utils/InputValidator')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Carts = new Schema({
    userId: {type: ObjectId, required: true, ref: 'users'},
    productId: {type: ObjectId, required: true, ref: 'products'},
    variationId: {type: ObjectId, required: true},
    quantity: {type: Number, required: true, default: 1},
    totalPrice: {type: Number, required: true},
})

Carts.statics.findCarts = function(filters = {}){
    const fieldsToCast = ['userId', 'productId', 'variationId']
    fieldsToCast.forEach((field) => {
        const id = filters[field]
        if (id && InputValidator.validateId(id))
            filters[field] = new mongoose.Types.ObjectId(id)
    })

    return this.aggregate([
        {
            $match: filters, //filters to match requirement
        },
        { //get product by productId
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'product',
            },
        },
        {
            $unwind: '$product',
        },
        { //get variation of that product that match variationId
            $addFields: {
                productVariation: {
                    $filter: {
                        input: '$product.variations',
                        as: 'variation',
                        cond: { $eq: ['$$variation._id', '$variationId'] },
                    },
                },
            },
        },
        {
            $unwind: '$productVariation',
        },
        { //re-calculate totalPrice for each cartProduct
            $addFields: {
                totalPrice: { $multiply: ['$productVariation.price', '$quantity'] },
            },
        },
        { //get shop info of that product
            $lookup: {
                from: 'shops',
                localField: 'product.shopId',
                foreignField: '_id',
                as: 'shop',
            },
        },
        {
            $unwind: '$shop',
        },
        { //group by product.shopId, use nessecary field
            $group: {
                _id: '$product.shopId',
                shopId: {$first: '$shop._id'},
                shopName: { $first: '$shop.name' },
                userId: { $first: '$userId' },
                products: {
                    $push: {
                        cartId: '$_id',
                        product: {
                            _id: '$productId',
                            name: '$product.name',
                            slug: '$product.slug',
                        },
                        variation: '$productVariation',
                        quantity: '$quantity',
                        totalPrice: '$totalPrice',
                    },
                },
            },
        },
        { //get result
            $project: {
                userId: 1,
                shopId: 1,
                shopName: 1,
                products: 1,
            },
        },
    ])
}

module.exports = mongoose.model('carts', Carts)