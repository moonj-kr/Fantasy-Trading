'use strict';
module.exports = (sequelize, DataTypes) => {
  const Portfolio = sequelize.define('Portfolio', {
    value: DataTypes.DOUBLE,
    buyingPower: DataTypes.DOUBLE,
    percentChange: DataTypes.DOUBLE,
    host: DataTypes.BOOLEAN,
    ranking: DataTypes.INTEGER,
    prevValues: DataTypes.ARRAY(DataTypes.DOUBLE),
    datesArray: DataTypes.ARRAY(DataTypes.DATE)
  }, {});
  Portfolio.associate = function(models) {
    Portfolio.belongsTo(models.League, {
      foreignKey: 'leagueID',
      onDelete: 'CASCADE',
    });
    Portfolio.belongsTo(models.User, {
      foreignKey: 'userID',
      onDelete: 'CASCADE',
    });
    Portfolio.hasMany(models.Transaction, {
      foreignKey: 'portfolioID',
      as: 'transactions',
    });

  };
  return Portfolio;
};
