const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
const Address = require('./Address')

const Shops = new Schema({
    sellerId: {type: ObjectId, required: true, ref: 'users'},
    name: {type: String, required: true},
    description: {type: String},
    logo: {type: String},
    follower: {type: Number, default: 0},
    address: {type: Address, required: true}, 
}, {
    timestamps: true,
})

module.exports = mongoose.model('shops', Shops)