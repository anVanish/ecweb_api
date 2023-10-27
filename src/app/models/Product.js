const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const Variation = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true}
})

const Products = new Schema({
    name: {type: String, required: true},
    images: [
        {type: String, required: true}
    ],
    category: {
        categoryId: {type: ObjectId, required: true},
        subCategoryId: {type: ObjectId, required: true}
    },
    description: {type: String},
    brand: {type: String},
    variations: [Variation],
    status: {type: String,  enum: ['new', 'used']},
    isDeleted: {type: Boolean},
    deletedAt: {type: Date},
}, {
    timestamps: true,
})

module.exports = mongoose.model('products', Products)