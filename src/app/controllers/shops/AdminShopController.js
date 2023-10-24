

class AdminShopController{
    //admin authentication
    //GET /api/shops/
    listShop(req, res){
        res.json('list of shops')
    }

    //GET /api/shops/:shopId/full
    fullShopDetail(req, res){
        res.json('full shop detail')
    }

    //POST /api/shops/
    addShop(req, res){
        res.json('add shop')
    }

    //PATCH /api/shops/:shopId
    updateShop(req, res){
        res.json('update shop')
    }

    //DELETE /api/shops/:shopId
    deleteShop(req, res){
        res.json('delete shop')
    }
}

module.exports = new AdminShopController()