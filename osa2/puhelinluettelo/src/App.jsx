import { useState } from 'react';

const Person = ({ person }) => (
	<li>
		{person.name}&nbsp;{person.number}
	</li>
);

const Field = ({ text, value, handleChange }) => (
	<div>
		{text}:
		<input
			style={{ margin: 5 }}
			value={value}
			onChange={(event) => handleChange(event.target.value)}
		/>
	</div>
);

const Filter = ({ filterTerm, setFilterTerm }) => (
	<form>
		<Field
			text={'Filter shown with'}
			value={filterTerm}
			handleChange={setFilterTerm}
		/>
	</form>
);

const PersonForm = ({
	addPerson,
	newName,
	setNewName,
	newNumber,
	setNewNumber,
}) => (
	<div>
		<h2>Add new</h2>
		<form onSubmit={addPerson}>
			<Field text={'Name'} value={newName} handleChange={setNewName} />
			<Field
				text={'Number'}
				value={newNumber}
				handleChange={setNewNumber}
			/>
			<div>
				<button type="submit">Add</button>
			</div>
		</form>
	</div>
);

const Persons = ({ filteredPersons }) => (
	<div>
		<h2>Numbers</h2>
		<ul>
			{filteredPersons.map((person) => (
				<Person key={person.name} person={person} />
			))}
		</ul>
	</div>
);

const App = () => {
	const [persons, setPersons] = useState([
		{ name: 'Arto Hellas', number: '040-123456' },
		{ name: 'Ada Lovelace', number: '39-44-5323523' },
		{ name: 'Dan Abramov', number: '12-43-234345' },
		{ name: 'Mary Poppendieck', number: '39-23-6423122' },
	]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filterTerm, setFilterTerm] = useState('');

	const addPerson = (event) => {
		event.preventDefault();
		const newPerson = {
			name: newName,
			number: newNumber,
		};

		if (persons.some((p) => p.name === newName)) {
			alert(`${newName} is already added to phonebook!`);
		} else {
			setPersons(persons.concat(newPerson));
			setNewName('');
			setNewNumber('');
		}
	};

	const filteredPersons = persons.filter((p) =>
		p.name.toLowerCase().includes(filterTerm.toLowerCase())
	);

	return (
		<div>
			<h1>Phonebook</h1>
			<Filter filterTerm={filterTerm} setFilterTerm={setFilterTerm} />
			<PersonForm
				{...{ addPerson, newName, setNewName, newNumber, setNewNumber }}
			/>
			<Persons filteredPersons={filteredPersons} />
		</div>
	);
};

export default App;
