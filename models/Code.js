const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const codeSchema = new mongoose.Schema({
	code: {
		type: Number,
		required: true,
	},
	user: {
		type: ObjectId,
		ref: 'User',
	},
});

module.exports = mongoose.model('Code', codeSchema);
