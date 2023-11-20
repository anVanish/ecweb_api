const express = require('express')
const morgan = require('morgan')
const route = require('./routes')
const db = require('./config/db')
const NotFoundError = require('./middlewares/notFoundHandling')
const handleCors = require('./middlewares/handleCors')
const dotenv = require('dotenv')
const errorHandling = require('./middlewares/errorHandling')

dotenv.config()

const app = express()
const port = 3001

db.connect()
//middlewares
app.use(handleCors);
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//routes
route(app)

//handle error
app.use(errorHandling)
//404 error
app.use(NotFoundError)

app.listen(port, ()=> console.log(`Web api started at http://localhost:${port}/api
Documentation available at http://localhost:${port}/api/docs`))
