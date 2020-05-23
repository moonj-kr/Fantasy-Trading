module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Stocks', [
      {
        symbol: 'AAPL',
        price: 314.96,
        isUpdated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        symbol: 'TSLA',
        price: 813.63,
        isUpdated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        symbol: 'FB',
        price: 213.19,
        isUpdated: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        symbol: 'AMZN',
        price: 2426.26,
        isUpdated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        symbol: 'MSFT',
        price: 184.91,
        isUpdated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Stocks', null, {});
  }
};
