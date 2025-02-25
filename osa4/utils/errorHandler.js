const { error } = require('./logger');

const errorHandler = (err, req, res, next) => {
	error(err.message);

	if (err.name === 'CastError') {
		return res.status(400).send({ error: 'malformed id' });
	}

	if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message });
	}

	next(err);
};

module.exports = errorHandler;
