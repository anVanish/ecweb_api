const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubCategory = new Schema({
    name: {type: String, required: true}
})

const Category = new Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    subCategories: [SubCategory]
})

module.exports = mongoose.model('categorise', Category)