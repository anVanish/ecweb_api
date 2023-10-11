const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const route = require('./routes')
const db = require('./config/db')
const NotFoundError = require('./middlewares/NotFoundError')
const modifyCors = require('./middlewares/ModifyCors')

const app = express()
const port = 3001


db.connect()
//middlewares
app.use(modifyCors);
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

//routes
route(app)

//404 error
app.use(NotFoundError)

app.listen(port, ()=> console.log(`Web api started at http://localhost:${port}/api`))
