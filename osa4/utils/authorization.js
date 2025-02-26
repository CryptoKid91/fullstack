const jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
	if (req.cookies.access_token) {
		const decodedToken = jwt.verify(
			req.cookies.access_token,
			process.env.SECRET
		);

		if (decodedToken.id) {
			req.username = decodedToken.username;
			req.uid = decodedToken.id;
		} else {
			return res.status(401).json({ error: 'token invalid' });
		}
	}

	return next();
};

module.exports = authorization;
