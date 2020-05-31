'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    volume: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    stockSymbol: DataTypes.STRING,
    type: DataTypes.ENUM(['buy', 'sell']),
    datetime: DataTypes.DATE
  }, {});
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.Portfolio, {
      foreignKey: 'portfolioID',
      onDelete: 'CASCADE',
    });
  };
  return Transaction;
};
