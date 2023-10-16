const homeRouter = require('./router/HomeRouter')
const authRouter = require('./router/AuthRouter')
const userRouter = require('./router/UserRouter')
const swaggerUi = require('swagger-ui-express')
const openapiSpecification = require('../app/helpers/SwaggerOptions')

function route(app){
    app.use('/api/auth', authRouter)
    app.use('/api/user', userRouter)
    app.use('/api', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
}

module.exports = route