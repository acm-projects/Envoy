require('colors')
require('dotenv').config()
const { connectDB } = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')
const express = require('express')
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/files', require('./routes/fileRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))