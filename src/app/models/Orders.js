const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Orders = new Schema({

})

module.exports = mongoose.model('orders', Orders)
