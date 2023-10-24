const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Shops = new Schema({
    sellerId: {type: ObjectId, required: true, ref: 'users'},
    name: {type: String, required: true},
    description: {type: String},
    logo: {type: String},
    follower: {type: Number, default: 0},
    createdAt: {type: Date, default: new Date()}
})

module.exports = mongoose.model('shops', Shops)