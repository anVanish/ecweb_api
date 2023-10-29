const { string } = require('joi')
const mongoose = require('mongoose')
const slugify = require('slugify')
const crypto = require('crypto')
const Schema = mongoose.Schema

const SubCategory = new Schema({
    name: {type: String, required: true},
    slug: {type: String, unique: true, default: function(){
        return slugify(`${this.name}-${crypto.randomBytes(4).toString('hex')}`, {lower: true})
    }}
})

const Category = new Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    slug: {type: String, unique: true, default: function(){
        return slugify(`${this.name}-${this._id}`, {lower: true})
    }},
    subCategories: [SubCategory]
})

module.exports = mongoose.model('categorise', Category)