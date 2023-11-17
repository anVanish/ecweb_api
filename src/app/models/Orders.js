const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
const Address = require('../../app/models/Address')

const Orders = new Schema({
    orderNumber: {type: String, unique: true, default: function(){
        return this._id.toString()
    }},
    status: {type: String, enum: ['to-pay', 'to-confirm', 'to-ship', 'to-receive', 'completed', 'canceled']}, 
    userId: {type: ObjectId, ref: 'users'},
    address: Address,
    shop: {
        _id: {type: ObjectId, ref: 'shops'},
        name: {type: String},
    },
    products: [{
        _id: {type: ObjectId, ref: 'products'},
        name: {type: String},
        slug: {type: String},
        variation: {
            _id: {type: ObjectId},
            name: {type: String},
            price: {type: Number},
        },
        quantity: {type: Number},
    }],
    shippingCost: {type: Number},
    totalPrice: {type: Number},
    statusHistory: [{
        date: {type: Date, default: new Date()},
        status: {type: String}
    }],
    shippingHistory: [{
        date: {type: Date, default: new Date()},
        description: {type: String},
    }],
    isDeleted: {type: Boolean},
    deletedAt: {type: Date}
}, {
    timestamps: true,
})

module.exports = mongoose.model('orders', Orders)
