const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
const crypto = require('crypto')

const Users = new Schema({
    _id: {type: ObjectId, default: new ObjectId()},
    name: {type: String},
    email: {type: String},
    password: {type: String},
    is_verified: {type: Boolean, default: false},
    phone: {type: String},
    gender: {type: String},
    birthday: {type: Date},
    is_seller: {type: Boolean, default: false},
})

module.exports = mongoose.model('users', Users)
