const stockProcessController = require('../controllers').stockProcessController;

module.exports = (app) => {
	app.get('/api/stocks/:isUpdated', stockProcessController.isStockUpdated);
	app.get('api/stocks', stockProcessController.updatePrice);
	app.get('api/stocks', stockProcessController.getStockPrice);
}
