const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const CartItems = new Schema({
    productId: {type: ObjectId, required: true, ref: 'products'},
    variation: {
        _id: {type: String, required: true},
        name: {type: String, required: true},
        price: {type: Number, required: true},
        stock: {type: Number, required: true},
    },
    quantity: {type: Number, required: true, default: 1},
    totalPrice: {type: Number, required: true}
})

const Carts = new Schema({
    userId: {type: ObjectId, required: true, ref: 'users'},
    items: [CartItems],
})

module.exports = mongoose.model('carts', Carts)