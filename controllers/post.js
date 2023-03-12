const Post = require('../models/Post');

exports.createPost = async (req, res) => {
	try {
		const post = await new Post(req.body).save();

		return res.status(201).json({
			post,
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};
