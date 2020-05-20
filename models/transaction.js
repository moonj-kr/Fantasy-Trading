'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    volume: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    type: DataTypes.ENUM(['buy', 'sell']),
    datetime: DataTypes.DATE
  }, {});
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.Stock, {
      foreignKey: 'stockID',
      onDelete: 'CASCADE',
    });
    Transaction.belongsTo(models.Portfolio, {
      foreignKey: 'portfolioID',
      onDelete: 'CASCADE',
    });
  };
  return Transaction;
};
