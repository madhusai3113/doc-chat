'use strict';

module.exports = function (app) {

	var user = require('../controllers/userController');
	var chat = require('../controllers/chatController');

	app.get('/', function (req, res) {
		res.sendFile('index.html');
	}); 
	
	app.get('/newClient', chat.NewClient);
	app.post('/chat', chat.NewMessage);
	app.post('/chat/messages', chat.AllMessages);


	app.post('/upload_photos', function (req, res) {

		if (req.method == 'POST') {
			var jsonString = '';

			console.log("hi");
		}
	});
	

	
};