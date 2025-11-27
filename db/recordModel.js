const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
	name: String,
	value: String,
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("Record", recordSchema);
