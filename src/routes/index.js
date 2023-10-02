const homeRouter = require('./router/HomeRouter')

function route(app){
    // app.use('/api/auth', homeRouter)
    app.use('/api', homeRouter)
}

module.exports = route