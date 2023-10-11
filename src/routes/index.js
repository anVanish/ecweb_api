const homeRouter = require('./router/HomeRouter')
const authRouter = require('./router/AuthRouter')
const userRouter = require('./router/UserRouter')

function route(app){
    app.use('/api/auth', authRouter)
    app.use('/api/user', userRouter)
    app.use('/api', homeRouter)
}

module.exports = route