const express = require('express')
const {getUsers} = require('../controllers/usersController')

const router = express.Router();

// users Routes


router.get('/users', getUsers);
module.exports = router
//export default router;
