const { pool } = require('../db/config')

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
module.exports = {getUsers};
