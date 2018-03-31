'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	created_date: {
		type: Date,
		default: Date.now()
	},
	username: {
		type: String,
		default: ""
	},
	age: {
		type: Number
	},
	symptoms: {
		type: [String]
	},
	status: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Users', UserSchema);