const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;
const oauth_link = 'https://developer.google.com/oauthplayground';
const { EMAIL, MAILING_ID, MAILING_SECRET, MAILING_REFRESH } = process.env;
const auth = new OAuth2(MAILING_ID, MAILING_SECRET, MAILING_REFRESH, oauth_link);

exports.sendVerificationEmail = (email, name, url) => {
	auth.setCredentials({
		refresh_token: MAILING_REFRESH,
	});
	const accessToken = auth.getAccessToken();
	const stmp = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: EMAIL,
			clientId: MAILING_ID,
			clientSecret: MAILING_SECRET,
			refreshToken: MAILING_REFRESH,
			accessToken,
		},
	});
	const mailOptions = {
		from: EMAIL,
		to: email,
		subject: 'Facebook email verification',
		html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:.5rem;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-weight:500;color:#3b5990">
        <img src="" alt="">
        <span>Action requise: Active your facebook account</span>
        </div>
        <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141023;font-size:17px;margin-bottom:1rem;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">
        <b>Hello ${name}</b>
        <div>Your recently created an account on Facebook. To complete registration, please confirm your account.</div>
        </div>
        <a style="display:inline-block;padding:10px 15px;background:#4c649b;text-decoration:none;color:#fff;font-weight:600;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif" href="${url}">Confirm your account</a>
        <div style="color:#9d9d9d;margin:10px 0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">
        <span>Facebook allows ayou to stay in touch with all your friends, once refistered on facebook, you can share
        photos, organize events and much more.</span>
        </div>`,
	};
	stmp.sendMail(mailOptions, (err, res) => {
		if (err) return err;
		return res;
	});
};

exports.sendResetCode = (email, name, code) => {
	auth.setCredentials({
		refresh_token: MAILING_REFRESH,
	});
	const accessToken = auth.getAccessToken();
	const stmp = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAUTH2',
			user: EMAIL,
			clientId: MAILING_ID,
			clientSecret: MAILING_SECRET,
			refreshToken: MAILING_REFRESH,
			accessToken,
		},
	});
	const mailOptions = {
		from: EMAIL,
		to: email,
		subject: 'Reset facebook password',
		html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:.5rem;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-weight:500;color:#3b5990">
        <img src="" alt="">
        <span>Action requise: Active your facebook account</span>
        </div>
        <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141023;font-size:17px;margin-bottom:1rem;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">
        <b>Hello ${name}</b>
        <div>Your recently created an account on Facebook. To complete registration, please confirm your account.</div>
        </div>
        <h4 style="color:red;font-weight:bolder;">${code}</h4>
        <div style="color:#9d9d9d;margin:10px 0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">
        <span>Facebook allows ayou to stay in touch with all your friends, once refistered on facebook, you can share
        photos, organize events and much more.</span>
        </div>`,
	};
	stmp.sendMail(mailOptions, (err, res) => {
		if (err) return err;
		return res;
	});
};
