const usersController = require('../controllers').usersController;
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'server/uploads/');
  },
  filename: function(req, file, cb){
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
    *   get:
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
    *   get:
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
    * /api/users/username:
    *   get:
    *     tags:
    *       - Users
    *     name: username
    *     summary: Retrieves username using userID
    *     parameters:
    *       - in: path
    *         name: userID
    *         schema:
    *           type: string
    *         required:
    *           - userID
    *     responses:
    *       200:
    *         description: Sucessfully username
  */
  app.get('/api/users/username/:userID', usersController.getUsername);
  /**
    * @swagger
    * /api/users/details:
    *   get:
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
    * /api/users/profile-details:
    *   post:
    *     tags:
    *       - Users
    *     name: profile-details
    *     summary: Update User's username,
    *     parameters:
    *       - in: body
    *         name: username
    *         type: string
    *         required: true
    *         description: New username
    *       - in: body
    *         name: email
    *         type: string
    *         required: true
    *         description: New email
    *       - in: body
    *         name: firstName
    *         type: string
    *         required: true
    *         description: New firstName
    *       - in: body
    *         name: lastName
    *         type: string
    *         required: true
    *         description: New lastName
    *       - in: body
    *         name: password
    *         type: string
    *         required: true
    *         description: New password
    *     responses:
    *       200:
    *         description: Sucessfully returns updated user
  */
  app.post('/api/users/profile-details', usersController.updateUser);
  /**
    * @swagger
    * /api/users/profile-picture:
    *   post:
    *     tags:
    *       - Users
    *     name: profile-picture
    *     summary: Uploads user profile picture to /uploads and saves path in User table
    *     consumes: multipart/form-data
    *     parameters:
    *       - in: body
    *         name: profilePicture
    *         type: file
    *         required: true
    *         description: profile picture image file
    *     responses:
    *       200:
    *         description: Sucessfully uploads user's profile picture
  */
  app.post('/api/users/profile-picture', upload.single('profilePicture'), usersController.uploadProfilePicture);
  /**
    * @swagger
    * /api/users/profile-picture:
    *   get:
    *     tags:
    *       - Users
    *     name: profile-picture
    *     summary: Return profile picture belonging to specified username, email, or request sessionID
    *     parameters:
    *       - in: body
    *         name: username
    *         type: string
    *         required: false
    *         description: Fetch profile picture for specified username
    *       - in: body
    *         name: email
    *         type: string
    *         required: false
    *         description: Fetch profile picture for specified email
    *     responses:
    *       200:
    *         description: Sucessfully returns profile picture
  */
  app.get('/api/users/profile-picture', usersController.getProfilePicture);
  /**
    * @swagger
    * /api/users/password:
    *   get:
    *     tags:
    *       - Users
    *     name: password
    *     summary: Change password
    *     parameters:
    *       - in: body
    *         name: oldPassword
    *         type: string
    *         required: true
    *         description: Old password needed for permission to execute this action
    *       - in: body
    *         name: newPassword
    *         type: string
    *         required: false
    *         description: New user password
    *     responses:
    *       200:
    *         description: Sucessfully updates user's password
  */
  app.post('/api/users/password', usersController.updatePassword);
}
