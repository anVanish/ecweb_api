const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Address = new Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    city: {type: String, required: true},
    district: {type: String, required: true},
    ward: {type: String, required: true},
    detail: {type: String, required: true},
})

module.exports = Address