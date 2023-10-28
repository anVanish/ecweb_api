const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId
const softDeleteFilter = require('../utils/SoftDeleteFilter')


const Variation = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true}
})

const Products = new Schema({
    shopId: {type: ObjectId, required: true, ref: 'shops'},
    name: {type: String, required: true},
    images: [
        {type: String, required: true}
    ],
    category: {
        categoryId: {type: ObjectId, required: true},
        subCategoryId: {type: ObjectId, required: true}
    },
    slug: {type: String, unique: true, default: function(){
        return slugify(`${this.name}-${this._id}`, {lower: true})
    }},
    description: {type: String},
    brand: {type: String},
    variations: [Variation],
    status: {type: String,  enum: ['new', 'used']},
    weight: {type: Number, required: true},
    packageSize: {
        width: {type: Number, required: true},
        length: {type: Number, required: true},
        height: {type: Number, required: true},
    },
    
    isDeleted: {type: Boolean},
    deletedAt: {type: Date},
}, {
    timestamps: true,
})

Products.statics.countProducts = function(filters={}, options={}){
    const productFilters = softDeleteFilter(filters, options)
    return this.countDocuments(productFilters)
}

Products.statics.findProducts = function(filters={}, options={}){
    const productFilters = softDeleteFilter(filters, options)
    return this.find(productFilters)
}

Products.statics.findOneProducts = function(filters={}, options={}){
    const productFilters = softDeleteFilter(filters, options)
    return this.findOne(productFilters)
}

Products.statics.findOneAndDeleteProducts = function(filters={}, options){
    const productFilters = softDeleteFilter(filters, {deleted: false})
    return this.findOneAndUpdate(productFilters, {isDeleted: true, deletedAt: new Date()}, options)
}

Products.statics.findOneAndRestoreProducts = function(filters, options){
    const productFilters = softDeleteFilter(filters, {deleted: true})
    return this.findOneAndUpdate(productFilters, {isDeleted: false}, options)
}

module.exports = mongoose.model('products', Products)