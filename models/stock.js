'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    symbol: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    isUpdated: DataTypes.BOOLEAN
  }, {});
  Stock.associate = function(models) {
    Stock.hasMany(models.Transaction, {
      foreignKey: 'stockID',
      as: 'stocks',
    });
  };
  return Stock;
};
