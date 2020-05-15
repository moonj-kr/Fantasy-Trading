const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./db/config')
const usersRoute = require('./routes/usersRoute')


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api', usersRoute);

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening`)
})
