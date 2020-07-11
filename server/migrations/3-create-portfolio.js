'use strict';
const Portfolio = require('../models').Portfolio

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
      buyingPower: {
        type: Sequelize.DOUBLE
      },
      percentChange:{
        type: Sequelize.DOUBLE
      },
      host: {
        type: Sequelize.BOOLEAN
      },
      ranking: {
        type: Sequelize.INTEGER
      },
      prevValues: {
        type: Sequelize.ARRAY(Sequelize.DOUBLE)
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Portfolios');
  }
};
