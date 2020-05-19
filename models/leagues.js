'use strict';
module.exports = (sequelize, DataTypes) => {
  const League = sequelize.define('League', {
    name: DataTypes.STRING,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    invitationKey: DataTypes.STRING,
    investmentFunds: DataTypes.DOUBLE
  }, {});
  League.associate = function(models) {
    // associations can be defined here
  };
  return League;
};
