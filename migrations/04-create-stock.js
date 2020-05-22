'use strict';
const Stock = require('../models').Stock;

const date = new Date(Date.now())

const data = [
  { symbol: 'MSFT', price: 183, isUpdated: false, createdAt: date, updatedAt: date },
  { symbol: 'AAPL', price: 307, isUpdated: true, createdAt: date, updatedAt: date },
  { symbol: 'STNE', price: 25, isUpdated: false, createdAt: date, updatedAt: date },
  { symbol: 'SBUX', price: 73, isUpdated: false, createdAt: date, updatedAt: date },
  { symbol: 'DKNG', price: 30, isUpdated: true, createdAt: date, updatedAt: date },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      symbol: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      isUpdated: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(Stock.bulkCreate(data));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Stocks');
  }
};
