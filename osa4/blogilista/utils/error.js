const error = (name, message = 'Unspecified error') => {
	const e = new Error(message);
	e.name = name;
	return e;
};

module.exports = error;
