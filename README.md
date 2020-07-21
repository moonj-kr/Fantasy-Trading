# Fantasy-Trading

Setup Instructions
  1. Install postgresql 11
  2. Install node.js
  3. Create user (name: fantasytrading) in postgresql with permissions "can login"
  4. Set password for this user
  5. Create database (name: fantasytrading) owned by user fantasytrading
  6. Create file called config.json  in config/ and copy and paste the contents from config_template.json into this file --> fill in password field
  7. cd server --> npm install
  8. cd ..
  9. cd client --> npm install
  10. cd ..
  11. npm install
  12. cd server 
  13. npx sequelize-cli db:migrate
  14. npm run dev
  15. server on localhost:5000/api
  
  # Troubleshooting Steps
  ERROR: Cannot find "/Users/jisook.moon/Desktop/Fantasy-Trading/config/config/config.json". Have you run "sequelize init"?
  - Reclone repo
  - Run npm install
  - Cry
  - Redo steps 6-11
  
  ERROR: role "fantasytrading" does not exist
  - This means that your database connection configuration is incorrect. Please check that your your config/config.json matches the information in pgAdmin under PostgreSQL ##'s Properties.
