const fs = require('fs');

module.exports = async function (req, res, next) {
	try {
		if (!req.files || Object.values(req.files).flat().length === 0) {
			return res.status(400).json({
				message: 'No files selected.',
				success: false,
			});
		}
		let files = Object.values(req.files).flat();
		files.forEach((file) => {
			if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/webp') {
				removeTmp(file.tempFilePath);
				return res.status(400).json({
					message: 'Unsupported format.',
					success: false,
				});
			}
			if (file.size > Math.pow(1024, 2) * 5) {
				removeTmp(file.tempFilePath);
				return res.status(400).json({
					message: 'File size is too large.',
					success: false,
				});
			}
		});
		next();
	} catch (error) {
		return res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};

const removeTmp = (path) => {
	fs.unlink(path, (error) => {
		if (error) throw error;
	});
};
