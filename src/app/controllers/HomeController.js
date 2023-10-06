
class HomeController{
    //GET /
    home(req, res){
        if (req.token)
            res.json(req.token)
        else
            res.json("Welcome")
    }
}

module.exports = new HomeController()