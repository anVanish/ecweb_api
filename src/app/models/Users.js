const mongoose = require('mongoose')
const Schema = mongoose.Schema
const softDeleteFilter = require('../utils/SoftDeleteFilter')
const Address = require('./Address')

const Users = new Schema({
    name: {type: String},
    email: {type: String, required: true},
    username: {type: String, default: function () {
        return this.email.split('@')[0];
      },
    },
    password: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    phone: {type: String},
    gender: {type: String},
    birthday: {type: Date},
    addresses: [Address],
    isSeller: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    isDeleted: {type: Boolean},
    createdAt: {type: Date, default: new Date()},
    deletedAt: {type: Date},
}, {
    timestamps: true,
})

//find users with default is not delete in database
Users.statics.countUsers = function(filters={}, options={}){
    const userFilters = softDeleteFilter(filters, options)
    return this.countDocuments(userFilters)
}

Users.statics.findUsers = function(filters={}, options={}){
    const userFilters = softDeleteFilter(filters, options)
    return this.find(userFilters)
}

Users.statics.findOneUsers = function(filters={}, options={}){
    const userFilters = softDeleteFilter(filters, options)
    return this.findOne(userFilters)   
}

Users.statics.findOneAndUpdateUsers = function(filters, updateData={}, options={}){
    const userFilters = softDeleteFilter(filters, options)
    return this.findOneAndUpdate(userFilters, updateData, options)
}

Users.statics.deleteUsersById = function(_id, options){
    return this.findByIdAndUpdate(_id, {isDeleted: true, deletedAt: new Date()}, options)
}

Users.statics.findOneAndRestoreUsers = function(filters, options){
    const userFilters = softDeleteFilter(filters, options)
    return this.findOneAndUpdate(userFilters, {isDeleted: false}, options)
}

module.exports = mongoose.model('users', Users)
