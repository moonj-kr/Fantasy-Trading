const stockProcessController = require('../controllers').stockProcessController;

module.exports = (app) => {
	app.get('/api/stocks/resetUpdates', stockProcessController.resetUpdates);
	app.get('/api/stocks/isStockUpdated/:symbol', stockProcessController.isStockUpdated);
	app.get('/api/stocks/updatePrice/:symbol', stockProcessController.updatePrice);
	app.get('/api/stocks/getStockPrice', stockProcessController.getStockPrice);
//	app.get('/api/stocks/addStock', stockProcessController.addStock);
//	app.get('/api/stocks/deleteStock', stockProcessController.deleteStock);
}
