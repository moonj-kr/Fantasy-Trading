'use strict';

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    shares: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    type: DataTypes.STRING
  }, {
    timestamps: true
  });
  Transaction.associate = function(models) {
    
  }
  return Transaction;
}