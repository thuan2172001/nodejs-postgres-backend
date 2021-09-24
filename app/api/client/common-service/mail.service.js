const {
	FRONTEND_BASE_URL,
	MAIL_NAME,
	MAIL_PASS,
} = require('../../../environment');

const _generateURL = ({ type, activeCode, userId }) => {
	if (type === 'reset-password')
		return `${_getFrontendBaseURL()}/reset-password?code=${activeCode}&user=${userId}`;
	else if (type === 'verify-email')
		return `${_getFrontendBaseURL()}/verify-email?code=${activeCode}&user=${userId}`;
	return ''
};

const _configEmailTemplate = ({ to, href, type }) => {
	switch (type) {
		case 'reset-password':
			return {
				from: 'TECHNICAL DEBT <MAIL_NAME>',
				to,
				subject: '[WEBTOONZ] Reset Password',
				html: resetPasswordTemplate(href),
			};

		case 'verify-email':
			return {
				from: 'TECHNICAL DEBT <MAIL_NAME>',
				to,
				subject: '[WEBTOONZ] Verification Email',
				html: resetPasswordTemplate(href),
			};

		default:
			throw new Error('INVALID_ACTION_TYPE');
	}
};

export const sendEmail = async ({ activeCode, email, type }) => {
	const smtpTransport = mailer.createTransport({
		service: 'gmail',
		auth: {
			user: MAIL_NAME,
			pass: MAIL_PASS,
		},
	});

	await smtpTransport.verify((err) => {
		if (err) {
			throw new Error('GMAIL.SERVICE_FAILED');
		}
	});

	const user = await Users.findOne({
		where: {
			email,
		}
	});

	if (!user) {
		throw new Error('USER.NOT_FOUND');
	}

	const href = _generateURL({ type, activeCode, userId: user._id });

	const mailDataConfig = _configEmailTemplate({ to: user.email, href, type });

	return new Promise((resolve, reject) => {
		smtpTransport.sendMail(mailDataConfig, (error, response) => {
			if (error) {
				return reject('GMAIL.SERVICE_FAILED');
			} else {
				smtpTransport.close();
				resolve(response);
			}
		});
	});
};
