'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
	created_date: {
		type: Date,
		default: Date.now()
	},
	sender: {
		type: String
	},
	recipient: {
		type: String
	},
	message: {
		type: String
	}
});

module.exports = mongoose.model('Messages', MessageSchema);