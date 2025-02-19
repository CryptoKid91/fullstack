const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());

const morgan = require('morgan');
app.use(morgan('tiny'));

app.use(express.static('dist'));

let persons = [
	{
		name: 'Arto Hellas',
		number: '040-123456',
		id: 1,
	},
	{
		name: 'Ada Lovelace',
		number: '39-44-5323523',
		id: 2,
	},
	{
		name: 'Dan Abramov',
		number: '12-43-234345',
		id: 3,
	},
	{
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
		id: 4,
	},
];

app.get('/info', (req, res) => {
	res.send(
		`Phonebook has info for ${
			persons.length
		} people<br /><br />${new Date()}`
	);
});

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

app.post('/api/persons', (req, res) => {
	const generateId = () => {
		return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
	};

	const body = req.body;

	if (!body.name) {
		return res.status(400).json({ error: 'name missing' });
	} else if (!body.number) {
		return res.status(400).json({ error: 'number missing' });
	} else if (persons.some((p) => p.name === body.name)) {
		return res.status(400).json({ error: 'name must be unique' });
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	};

	persons = persons.concat(person);
	res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find((p) => p.id === id);
	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

app.put('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const body = req.body;
	const person = persons.find((p) => p.id === id);

	if (person) {
		const newPerson = {
			name: body.name,
			number: body.number,
			id: person.id,
		};
		persons = persons.map((p) => (p.id == person.id ? newPerson : p));
		res.json(newPerson);
	} else {
		res.status(404).end();
	}
});

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);

	if (persons.some((p) => p.id === id)) {
		persons = persons.filter((p) => p.id !== id);
		res.status(204).end();
	} else {
		res.status(404).end();
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
