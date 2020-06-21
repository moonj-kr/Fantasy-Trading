'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    points: DataTypes.INTEGER,
    profilePicture: DataTypes.STRING,
    sessionID: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Portfolio, {
      foreignKey: 'userID',
      as: 'portfolios',
    });
  };
  return User;
};
