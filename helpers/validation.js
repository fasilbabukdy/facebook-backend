const User = require('../models/User');

exports.validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

exports.validateLength = (text, min, max) => {
	if (text.length > max || text.length < min) {
		return false;
	}
	return true;
};

exports.validateUsername = async (username) => {
	let isCheck = false;
	do {
		let checkUsername = await User.findOne({ username });
		if (checkUsername) {
			username += (+new Date() * Math.random()).toString().substring(1, 2);
			isCheck = true;
		} else {
			isCheck = false;
		}
	} while (isCheck);
	return username;
};
