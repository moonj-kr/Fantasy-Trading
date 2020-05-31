module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Portfolios', [
      {
        value: 11000.00,
        host: true,
        ranking: 2,
        leagueID: 1,
        userID: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        value: 2000.00,
        host: false,
        ranking: 3,
        leagueID: 1,
        userID: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        value: 14000.00,
        host: false,
        ranking: 1,
        leagueID: 1,
        userID: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        value: 18000.00,
        host: true,
        ranking: 3,
        leagueID: 2,
        userID: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        value: 21000.00,
        host: false,
        ranking: 2,
        leagueID: 2,
        userID: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        value: 23000.00,
        host: false,
        ranking: 1,
        leagueID: 2,
        userID: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Portfolios', null, {});
  }
};
