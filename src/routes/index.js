const homeRouter = require('./router/HomeRouter')
const authRouter = require('./router/AuthRouter')

function route(app){
    app.use('/api/auth', authRouter)
    app.use('/api', homeRouter)
}

module.exports = route