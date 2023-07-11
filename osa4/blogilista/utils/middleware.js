const logger = require('./logger');

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
	logger.error(err.message);

	switch (err.name) {
		case 'CastError':
			return res.status(400).send({ error: 'Malformatted id' });
		case 'NoContent':
			return res.status(400).send({ error: err.message });
		case 'ValidationError':
			return res.status(400).json({ error: err.message });
		case 'NotFound':
			return res.status(404).json({ error: err.message });
		default:
			next(err);
	}
};

module.exports = {
	unknownEndpoint,
	errorHandler,
};
