module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Portfolios', [
      {
        value: 10200.76,
        buyingPower: 236.24,
        percentChange: 0.00,
        host: true,
        ranking: 2,
        leagueID: 1,
        userID: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        value: 9000.04,
        buyingPower: 294.96,
        percentChange: 0.00,
        host: false,
        ranking: 3,
        leagueID: 1,
        userID: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        value: 12000.35,
        buyingPower: 125.65,
        percentChange: 0.00,
        host: false,
        ranking: 1,
        leagueID: 1,
        userID: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        value: 21000.89,
        buyingPower: 10244.11,
        percentChange: 0.00,
        host: true,
        ranking: 3,
        leagueID: 2,
        userID: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        value: 22000.97,
        buyingPower: 10283.03,
        percentChange: 0.00,
        host: false,
        ranking: 2,
        leagueID: 2,
        userID: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        value: 18000.11,
        buyingPower: 11615.89,
        percentChange: 0.00,
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
