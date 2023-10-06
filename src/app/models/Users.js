const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
const crypto = require('crypto')

const Users = new Schema({
    _id: {type: ObjectId, default: new ObjectId()},
    name: {type: String},
    email: {type: String},
    password: {type: String},
    verify_data: {
        is_verified: {type: Boolean, default: false},
        code: {type: String, default: crypto.randomBytes(24).toString('hex')},
        expired_date: {type: Date, default: new Date().setDate(new Date().getDate() + 1)}
    },
    phone: {type: String},
    gender: {type: String},
    birthday: {type: Date},
    is_seller: {type: Boolean, default: false},
})

module.exports = mongoose.model('users', Users)
