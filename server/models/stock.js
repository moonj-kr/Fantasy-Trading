'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    symbol: DataTypes.STRING,
    company: DataTypes.STRING
  }, {});
  Stock.associate = function(models) {

  };
  return Stock;
};
