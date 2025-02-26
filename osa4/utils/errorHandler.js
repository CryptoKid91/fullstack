const { error } = require('./logger');

const errorHandler = (err, req, res, next) => {
	error(err.message);

	switch (err.name) {
		case 'CastError':
			return res.status(400).send({ error: 'malformed id' });
		case 'ValidationError':
			return res.status(400).json({ error: err.message });
		case 'JsonWebTokenError':
			return response.status(401).json({ error: 'token invalid' });
	}

	next(err);
};

module.exports = errorHandler;
