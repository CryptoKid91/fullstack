require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('build'));

const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
morgan.token('postData', (req, res) => JSON.stringify(req.body));
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :postData'
	)
);

const Person = require('./models/person');

app.get('/info', (req, res, next) => {
	Person.find({})
		.then((people) => {
			res.send(
				`<div>Phonebook has info for ${people.length} people.</div>
		<br />
		<div>${new Date()}</div>`
			);
		})
		.catch(next);
});

app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then((people) => res.json(people))
		.catch(next);
});

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			res.json(person);
		})
		.catch(next);
});

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then((result) => {
			res.status(204).end();
		})
		.catch(next);
});

app.post('/api/persons', (req, res, next) => {
	const body = req.body;

	if (!body.name || !body.number) {
		let err = new Error('No content');
		err.name = 'NoContent';
		throw err;
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => res.json(savedPerson))
		.catch(next);
});

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then((updatedPerson) => res.json(updatedPerson))
		.catch(next);
});

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
	console.error(err.message);

	switch (err.name) {
		case 'CastError':
			return res.status(400).send({ error: 'Malformatted id' });
			break;
		case 'NoContent':
			return res.status(400).send({ error: 'Content missing' });
			break;
	}

	next(err);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
