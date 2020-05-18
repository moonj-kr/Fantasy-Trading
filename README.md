# Fantasy-Trading

Setup Instructions
  1. Install postgresql 11
  2. Install node.js
  3. Create user (name: fantasytrading) in postgresql with permissions "can login"
  4. Set password for this user
  5. Create database (name: fantasytrading) owned by user fantasytrading
  6. Create file called config.json  in config/ and copy and paste the contents from config_template.json into this file --> fill in password field
  7. npm install
  8. npx sequelize-cli db:migrate
  8. npm start
  9. server on localhost:5000/api
