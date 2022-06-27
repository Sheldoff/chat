const { Schema, Types } = require('mongoose')

module.exports.messages = new Schema({// format of database 'Table' that have name 'messages'
	name:			    { type: String, required: true },
	message:            { type: String, required: true },
	timestamp:	        { type: Number, required: true },
})


module.exports.accounts = new Schema({
	login:			    { type: String, required: true, indexed: true, unique: true },
	password:			{ type: String, required: true },
	username:			{ type: String, required: true },
	registrationDate:	{ type: Number, required: true },
	avaratURL:			{ type: String},
})