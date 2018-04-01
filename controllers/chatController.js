'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Message = mongoose.model('Messages');

var Bot = function (user_id) {
	var MessageGenerator = function (message, user_id) {
		var messageObject = {
			message: message,
			sender: 0,
			recipient: user_id
		};
		console.log(messageObject);
		Message.create(messageObject, function (err, message) {
			return message;
		});
	}

	User.findOne({_id: user_id}, function (err, user) {
		if (err) {
			res.send(err);
			return;
		}
		
		switch (user.status) {
			case 0:
				return MessageGenerator("Please enter your name: ", user_id);
			case 1:
				return MessageGenerator("Please enter your age: ", user_id);
			case 2:
				return MessageGenerator("Please enter your symptoms", user_id);
			case 3:
				return MessageGenerator("Please provide diag files", user_id);
			case 4:
				return MessageGenerator("Connecting to doctor...", user_id);
		}
	});
};

exports.NewClient = function (req, res) {

	User.create(req.body, function (err, user) {
		if (err) {
			res.send(err);
			return;
		}
		res.send(user._id);
	});
 
}

exports.NewMessage = function (req, res) {
	
	Message.create(req.body, function (err, message) {
		if (err) {
			res.send(err);
			return;
		}

		// if (req.body.status < 5) {
			// let resp = Bot(req.body.sender);
		// }
		res.send(message);
	});

}

exports.AllMessages = function (req, res) {

	let user_id = req.body.user_id;
	let part_id = req.body.part_id;
	
	Message.find({
		$or: [
			{
				sender:    user_id,
				recipient: part_id
			},
			{
				sender:    part_id,
				recipient: user_id
			}
		]
	}, function (err, messages) {
		if (err) {
			res.send(err);
			return;
		}
		res.send(messages);
	});
}
