

class ShopController{
    //no authentication
    //GET /api/shops/:shopId
    detailShop(req, res){
        res.json('shop\'s detail')
    }

    //GET /api/shops/:shopId/products
    shopProduct(req, res){
        res.json('products of shop')
    }
}

module.exports = new ShopController()