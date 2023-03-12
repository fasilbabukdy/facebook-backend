const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Code = require('../models/Code');
const { validateEmail, validateLength, validateUsername } = require('../helpers/validation');
const { generateToken } = require('../helpers/tokens');
const { sendVerificationEmail, sendResetCode } = require('../helpers/mailer');
const generateCode = require('../helpers/generateCode');

exports.register = async (req, res) => {
	try {
		const { first_name, last_name, username, email, password, bYear, bMonth, bDay, gender } = req.body;
		if (!validateEmail(email)) {
			return res.status(400).json({
				message: 'Invalid email address',
				success: false,
			});
		}

		const checkMail = await User.findOne({ email });
		if (checkMail) {
			return res.status(400).json({
				message: 'This email address already exists, try with a different email address.',
				success: false,
			});
		}

		if (!validateLength(first_name, 3, 30)) {
			return res.status(400).json({
				message: 'First Name must between 3 and 30 characters.',
				success: false,
			});
		}

		if (!validateLength(last_name, 3, 30)) {
			return res.status(400).json({
				message: 'Last Name must between 3 and 30 characters.',
				success: false,
			});
		}

		if (!validateLength(password, 6, 40)) {
			return res.status(400).json({
				message: 'Password must be atleast 6 characters.',
				success: false,
			});
		}

		const cryptedPassword = await bcrypt.hash(password, 12);
		const tempUsername = first_name + last_name;
		const newUsername = await validateUsername(tempUsername);
		const user = await new User({
			first_name,
			last_name,
			username: newUsername,
			email,
			password: cryptedPassword,
			bYear,
			bMonth,
			bDay,
			gender,
		}).save();

		const emailVerificationToken = generateToken({ id: user._id.toString() }, '30m');
		const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
		sendVerificationEmail(user.email, user.first_name + ' ' + user.last_name, url);

		const token = generateToken({ id: user._id.toString() }, '7d');
		res.status(201).json({
			id: user._id,
			username: user.username,
			picture: user.picture,
			first_name: user.first_name,
			last_name: user.last_name,
			verified: user.verified,
			token,
			message: 'Register success, Please activate your email to start.',
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

exports.activateAccount = async (req, res) => {
	const { token } = req.body;
	const user = jwt.verify(token, process.env.TOKEN_SECRET);
	const checkUser = await User.findById(user.id);
	if (checkUser.verified === true) {
		return res.status(400).json({
			message: 'This email is already activated.',
			success: false,
		});
	} else {
		await User.findByIdAndUpdate(user.id, { verified: true });
		return res.status(200).json({
			message: 'Account has been activated successfully.',
			success: true,
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				message: 'The email address you entered is not connected to an account.',
				success: false,
			});
		}

		const checkPassword = await bcrypt.compare(password, user.password);
		if (!checkPassword) {
			return res.status(400).json({
				message: 'Invalid credentials, Please try again.',
				success: false,
			});
		}

		const token = generateToken({ id: user._id.toString() }, '7d');
		return res.status(201).json({
			id: user._id,
			username: user.username,
			picture: user.picture,
			first_name: user.first_name,
			last_name: user.last_name,
			verified: user.verified,
			token,
			message: 'Register success, Please activate your email to start.',
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

exports.sendVerification = async (req, res) => {
	try {
		console.log('first', req);
		const id = req.user.id;
		const user = await User.findById(id);
		if (user.verified === true) {
			return res.status(400).json({
				message: 'This account is already activated.',
				success: true,
			});
		}
		const emailVerificationToken = generateToken({ id: user._id.toString() }, '30m');
		const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
		sendVerificationEmail(user.email, user.first_name + ' ' + user.last_name, url);

		return res.status(200).json({
			message: 'Email verification link has been send to your email.',
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

exports.findUser = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email }).select('-password');
		if (!user) {
			return res.status(400).json({
				message: "Account doesn't exist.",
				success: false,
			});
		}
		return res.status(200).json({
			email: user.email,
			picture: user.picture,
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

exports.sendResetPasswordCode = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email }).select('-password');
		await Code.findOneAndRemove({ user: user._id });
		const code = generateCode(5);
		await new Code({ code, user: user._id }).save();
		// sendResetCode(user.email, user.first_name + ' ' + user.last_name, code);
		return res.status(200).json({
			message: 'Email reset code has been sent to your email account.',
			code,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

exports.validateResetCode = async (req, res) => {
	try {
		const { email, code } = req.body;
		const user = await User.findOne({ email });
		const resetCode = await Code.findOne({ user: user._id });
		console.log('curr code', typeof code);
		console.log('db code', typeof resetCode.code);

		if (+resetCode.code !== +code) {
			return res.status(400).json({
				message: 'Verification code is wrong.',
				success: false,
			});
		}
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

exports.changePassword = async (req, res) => {
	try {
		const { email, password } = req.body;
		const crypetedPassword = await bcrypt.hash(password, 12);
		await User.findOneAndUpdate({ email }, { password: crypetedPassword });
		return res.status(200).json({
			message: 'Your password has been changed.',
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};
