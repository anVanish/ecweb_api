const swaggerJsdoc = require('swagger-jsdoc')
const path = require('path')

const options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Ecommerce Website API',
        version: '1.0.0',
        contact: {
            'email': 'sosvanish@gmail.com'
        },
        description: `Website API dùng cho website sàn thương mại điện tử sử dụng mẫu của openAPI 3.0. Truy cập vào giao diện tại [https://swagger.io](https://swagger.io).`,
        
      },
      servers: [
        {
          url: 'https://ecwebsite.onrender.com/api'
        },
        {
          url: 'https://tiny-jade-elk-wear.cyclic.cloud/api'
        },
        {
          url: 'http://localhost:3001/api'
        },
      ],
    },
    apis: [path.resolve(__dirname, '../../../swagger', '*.yaml')],
}
const openapiSpecification = swaggerJsdoc(options)


module.exports = openapiSpecification