const logger = require('./logger');
const error = require('./error');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
	logger.error(err.message);

	switch (err.name) {
		case 'CastError':
			return res.status(400).send({ error: 'Malformatted id' });
		case 'NoContent':
		case 'ValidationError':
		case 'PasswordInvalid':
			return res.status(400).json({ error: err.message });
		case 'NotFound':
			return res.status(404).json({ error: err.message });
		case 'LoginError':
		case 'AuthError':
			return res.status(401).json({ error: err.message });
		default:
			next(err);
	}
};

const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		req.token = authorization.replace(/^bearer\s/i, '');
	}

	next();
};

const userExtractor = async (req, res, next) => {
	const authorization = req.get('authorization');

	let token;
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		token = authorization.replace(/^bearer\s/i, '');
	} else {
		next();
		return;
	}

	token = jwt.verify(token, process.env.SECRET);

	if (!token.id) {
		throw error('AuthError', 'token invalid');
	}

	const user = await User.findById(token.id);
	if (!user) {
		throw error('AuthError', 'invalid user');
	}

	req.user = user;
	next();
};

module.exports = {
	unknownEndpoint,
	errorHandler,
	userExtractor,
};
