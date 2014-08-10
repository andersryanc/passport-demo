var mongoose = require('mongoose')
var Schema   = mongoose.Schema

var Location = new Schema({
	name: String,
	rating: Number,
	created_at: Date
})

module.exports = mongoose.model( 'Location', Location )
