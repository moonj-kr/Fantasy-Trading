'use strict';

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    shares: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    transactionType: DataTypes.STRING
  }, {
    timestamps: true
  });
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.Portfolio, {
      foreignKey: 'portfolioID',
      onDelete: 'CASCADE'
    });
    Transaction.belongsTo(models.Stock, {
      foreignKey: 'stockID',
      onDelete: 'CASCADE'
    });
  }
  return Transaction;
}