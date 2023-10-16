const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Users = new Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    is_verified: {type: Boolean, default: false},
    phone: {type: String},
    gender: {type: String},
    birthday: {type: Date},
    is_seller: {type: Boolean, default: false},
    is_admin: {type: Boolean, default: false},
})

module.exports = mongoose.model('users', Users)
