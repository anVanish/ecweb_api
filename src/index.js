const express = require('express')
const morgan = require('morgan')
const route = require('./routes')
const db = require('./config/db')
const NotFoundError = require('./middlewares/NotFoundError')
const modifyCors = require('./middlewares/ModifyCors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = 3001

db.connect()
//middlewares
app.use(modifyCors);
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//routes
route(app)

//404 error
app.use(NotFoundError)

app.listen(port, ()=> console.log(`Web api started at http://localhost:${port}/api`))
