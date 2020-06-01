const usersController = require('../controllers').usersController;
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    console.log(req)
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null, true);
  } else {
    // reject all other file types
    cb(null, false);
  }
};


//limits files to 5 mb
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


//const upload = multer({dest: 'uploads/'})

module.exports = (app) => {
  /**
    * @swagger
    * /api/users/register:
    *   post:
    *     tags:
    *       - Users
    *     name: register
    *     summary: Create User
    *     parameters:
    *       - in: body
    *         name: username
    *         type: string
    *         description: Username for new account
    *       - in: body
    *         name: password
    *         type: string
    *         description: Password for new account
    *       - in: body
    *         name: firstName
    *         type: string
    *         description: User's first name
    *       - in: body
    *         name: lastName
    *         type: string
    *         description: User's last name
    *       - in: body
    *         name: email
    *         type: string
    *         description: User's email
    *     responses:
    *       200:
    *         description: Sucessfully creates new user
  */
  app.post('/api/users/register', usersController.register);
  /**
    * @swagger
    * /api/users/login:
    *   post:
    *     tags:
    *       - Users
    *     name: login
    *     summary: Login User
    *     parameters:
    *       - in: body
    *         name: username
    *         type: string
    *         description: Username entered for login
    *       - in: body
    *         name: email
    *         type: string
    *         description: Email entered for login
    *       - in: body
    *         name: password
    *         type: string
    *         description: User's password
    *     responses:
    *       200:
    *         description: Sucessfully logged in user
  */
  app.post('/api/users/login', usersController.login);
  /**
    * @swagger
    * /api/users/logout:
    *   post:
    *     tags:
    *       - Users
    *     name: logout
    *     summary: Logout User by clearing its sessionID
    *     responses:
    *       200:
    *         description: Sucessfully logs out user
  */
  app.get('/api/users/logout', usersController.logout);
  /**
    * @swagger
    * /api/users/leagues:
    *   post:
    *     tags:
    *       - Users
    *     name: leagues
    *     summary: Retrieves all leagues user is currently participating in
    *     responses:
    *       200:
    *         description: Sucessfully lists user's leagues
  */
  app.get('/api/users/leagues', usersController.leagues);
  /**
    * @swagger
    * /api/users/details:
    *   post:
    *     tags:
    *       - Users
    *     name: profile-details
    *     summary: Returns User object matching request sessionID
    *     responses:
    *       200:
    *         description: Sucessfully returns User object
  */
  app.get('/api/users/profile-details', usersController.getUser);
  /**
    * @swagger
    * /api/users/update:
    *   post:
    *     tags:
    *       - Users
    *     name: profile-details
    *     summary: Update User's username,
    *     parameters:
    *       - in: body
    *         name: username
    *         type: string
    *         description: Username entered for login
    *       - in: body
    *         name: email
    *         type: string
    *         description: Email entered for login
    *       - in: body
    *         name: password
    *         type: string
    *         description: User's password
    *     responses:
    *       200:
    *         description: Sucessfully updated user fields
  */
  app.post('/api/users/profile-details', usersController.updateUser);
  app.post('/api/users/profile-picture', upload.single('profilePicture'), usersController.uploadPicture);
}
