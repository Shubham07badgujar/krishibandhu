const schemeController = require('./controllers/schemeController');

console.log('Controller exports:', Object.keys(schemeController));
console.log('createScheme type:', typeof schemeController.createScheme);
console.log('saveScheme type:', typeof schemeController.saveScheme);
