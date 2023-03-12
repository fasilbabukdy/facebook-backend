const express = require('express');
const {
	register,
	activateAccount,
	login,
	sendVerification,
	findUser,
	sendResetPasswordCode,
	validateResetCode,
	changePassword,
} = require('../controllers/user');
const { authUser } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', register);
router.post('/activate', authUser, activateAccount);
router.post('/login', login);
router.post('/send-verification', authUser, sendVerification);
router.post('/find-user', findUser);
router.post('/send-reset-password-code', sendResetPasswordCode);
router.post('/validate-reset-code', validateResetCode);
router.post('/change-password', changePassword);

module.exports = router;
