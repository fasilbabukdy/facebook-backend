const jwt = require('jsonwebtoken');

exports.authUser = async (req, res, next) => {
	try {
		let header = req.header('Authorization');
		const token = header ? header.split(' ')[1].toString() : '';
		console.log(token);
		if (!token) {
			return res.status(400).json({
				message: 'Invalid Authentication.',
				success: false,
			});
		}
		jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
			if (err) {
				return res.status(400).json({
					message: 'Invalid Authentication..',
					success: false,
				});
			}
			req.user = user;
			next();
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};
