'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    points: DataTypes.INTEGER,
    profilePicture: type: DataTypes.STRING,
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
