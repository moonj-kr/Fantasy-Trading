'use strict';

module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    symbol: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    isUpdated: DataTypes.BOOLEAN
  }, {
    timestamps: true
  });
  return Stock;
}