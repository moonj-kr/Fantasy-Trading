'use strict';
const Portfolio = require('../models').Portfolio

const date = new Date(Date.now())

const data = [
  { value: 1000.00, host: false, ranking: 1, createdAt: date,  updatedAt: date },
  { value: 2000.00, host: false, ranking: 3, createdAt: date,  updatedAt: date },
  { value: 3000.00, host: true, ranking: 5, createdAt: date,  updatedAt: date },
  { value: 4000.00, host: true, ranking: 7, createdAt: date,  updatedAt: date },
  { value: 5000.00, host: true, ranking: 9, createdAt: date,  updatedAt: date },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Portfolios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      value: {
        type: Sequelize.DOUBLE
      },
      host: {
        type: Sequelize.BOOLEAN
      },
      ranking: {
        type: Sequelize.INTEGER
      },
      leagueID: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Leagues',
          key: 'id',
          as: 'leagueID',
        }
      },
      userID: {
        type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'Users',
            key: 'id',
            as: 'userID',
          }
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
    .then(Portfolio.bulkCreate(data));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Portfolios');
  }
};
