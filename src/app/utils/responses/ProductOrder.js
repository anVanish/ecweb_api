//get necessary info of product for order
class ProductOrder{
    constructor(product, variationId, quantity){
        this._id = product._id
        this.name = product.name
        this.slug = product.slug
        const variation = product.variations.id(variationId)
        const {stock, ...others} = variation.toObject()
        this.variation = others
        this.quantity = quantity
    }
} 

module.exports = ProductOrder