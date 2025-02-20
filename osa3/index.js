require('dotenv').config();

const express = require('express');
const app = express();

const Person = require('./models/person');

const cors = require('cors');
app.use(cors());

app.use(express.json());

const morgan = require('morgan');
app.use(morgan('tiny'));

app.use(express.static('dist'));

app.get('/info', (req, res, next) => {
	Person.countDocuments({})
		.then((count) =>
			res.send(
				`Phonebook has info for ${count} people<br /><br />${new Date()}`
			)
		)
		.catch((e) => next(e));
});

app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then((persons) => {
			res.json(persons);
		})
		.catch((e) => next(e));
});

app.post('/api/persons', (req, res, next) => {
	const body = req.body;

	if (!body.name) {
		return res.status(400).json({ error: 'name missing' });
	} else if (!body.number) {
		return res.status(400).json({ error: 'number missing' });
		//} else if (persons.some((p) => p.name === body.name)) {
		//	return res.status(400).json({ error: 'name must be unique' });
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((p) => res.json(p))
		.catch((e) => next(e));
});

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) {
				res.json(person);
			} else {
				res.status(404).end();
			}
		})
		.catch((e) => next(e));
});

app.put('/api/persons/:id', (req, res, next) => {
	const { name, number } = req.body;

	Person.findByIdAndUpdate(
		req.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: 'query' }
	)
		.then((updatedPerson) => {
			res.json(updatedPerson);
		})
		.catch((e) => next(e));
});

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndDelete(req.params.id)
		.then((result) => {
			if (result) {
				res.status(204).end();
			} else {
				res.status(404).end();
			}
		})
		.catch((e) => next(e));
});

const errorHandler = (error, req, res, next) => {
	console.log(error.message);

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformed id' });
	}

	if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const { PORT } = process.env;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
