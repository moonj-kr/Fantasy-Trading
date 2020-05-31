module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Transactions', [
      {
        volume: 31,
        price: 314.96,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'AAPL',
        percentChange: 0.00,
        portfolioID: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        volume: 4,
        price: 2426.26,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'AMZN',
        percentChange: 0.00,
        portfolioID: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        volume: 6,
        price: 813.63,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'TSLA',
        percentChange: 0.00,
        portfolioID: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        volume: 27,
        price: 184.91,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'MSFT',
        percentChange: 0.00,
        portfolioID: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        volume: 2,
        price: 2426.26,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'AMZN',
        percentChange: 0.00,
        portfolioID: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        volume: 23,
        price: 213.19,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'FB',
        percentChange: 0.00,
        portfolioID: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        volume: 15,
        price: 314.96,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'AAPL',
        percentChange: 0.00,
        portfolioID: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        volume: 27,
        price: 184.91,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'MSFT',
        percentChange: 0.00,
        portfolioID: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        volume: 3,
        price: 813.63,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'TSLA',
        percentChange: 0.00,
        portfolioID: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        volume: 14,
        price: 213.19,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'FB',
        percentChange: 0.00,
        portfolioID: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        volume: 16,
        price: 184.91,
        type: 'buy',
        datetime: new Date(),
        stockSymbol: 'MSFT',
        percentChange: 0.00,
        portfolioID: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ]);
},
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Transactions', null, {});
  }
};
