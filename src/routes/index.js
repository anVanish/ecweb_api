const authRouter = require('./router/AuthRouter')
const userRouter = require('./router/UserRouter')
const shopRouter = require('./router/ShopRouter')
const addressRouter = require('./router/AddressRouter')
const swaggerUi = require('swagger-ui-express')
const openapiSpecification = require('../app/utils/SwaggerOptions')

function route(app){
    app.use('/api/auth', authRouter)
    app.use('/api/users', userRouter)
    app.use('/api/shops', shopRouter)
    app.use('/api/addresses', addressRouter)
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
}

module.exports = route