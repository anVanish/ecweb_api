

class SellerShopController{
    //seller authentication
    //GET /api/shops/me
    getMyShop(req, res){
        res.json('my shop')
    }

    //GET /api/shops/me/products
    myShopProduct(req, res){
        res.json('products of my shop')
    }

    //POST /api/shops/me
    registerSeller(req, res){
        res.json('register seller')
    }

    //PATCH /api/shops/me
    updateMyShop(req, res){
        res.json('update my shop')
    }

    //DELETE /api/shops/me
    deleteMyShop(req, res){
        res.json('delete my shop')
    }
}

module.exports = new SellerShopController()