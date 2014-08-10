var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var User = new Schema({
	username: String,
	password: String,
	name: String,
	created_at: Date
})

module.exports = mongoose.model( 'User', User )
