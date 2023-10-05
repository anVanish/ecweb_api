
class HomeController{
    //GET /
    home(req, res){
        res.json("Hello, world!")
    }
}

module.exports = new HomeController()