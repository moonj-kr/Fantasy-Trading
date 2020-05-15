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

// const getUsers = (request, response) => {
//   pool.query("SELECT * FROM users", (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).json(results.rows)
//   })
// }

// const addBook = (request, response) => {
//   const { author, title } = request.body
//
//   pool.query('INSERT INTO books (author, title) VALUES ($1, $2)', [author, title], error => {
//     if (error) {
//       throw error
//     }
//     response.status(201).json({ status: 'success', message: 'Book added.' })
//   })
// }

// app
  //.route('/users')
  // GET endpoint
  // .get(getUsers)
  // POST endpoint
  //.post(addBook)

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening`)
})
