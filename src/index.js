const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const route = require('./routes')
const db = require('./config/db')
const NotFoundError = require('./middlewares/NotFoundError')

const app = express()
const port = 3000

db.connect()
//middlewares
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//routes
route(app)

//404 error
app.use(NotFoundError)

app.listen(port, ()=> console.log(`Web api started at http://localhost:${port}/api`))
