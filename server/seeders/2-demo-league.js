module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Leagues', [
      {
        name: 'Kick Ass Stock Traders',
        startDate: '2020-05-01',
        endDate: '2020-07-01',
        investmentFunds: 10000,
        invitationKey: '012345abcdef',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Finance Gods',
        startDate: '2020-06-01',
        endDate: '2020-09-01',
        investmentFunds: 20000,
        invitationKey: 'abcdef012345',
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Leagues', null, {});
  }
};
