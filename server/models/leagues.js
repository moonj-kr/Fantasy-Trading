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
    League.hasMany(models.Portfolio, {
      foreignKey: 'leagueID',
      as: 'portfolios',
    });
  };
  return League;
};
