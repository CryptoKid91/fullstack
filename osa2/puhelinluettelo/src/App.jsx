import { useState, useEffect } from 'react';
import axios from 'axios';

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
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filterTerm, setFilterTerm] = useState('');

	useEffect(() => {
		axios.get('http://localhost:3001/persons').then((response) => {
			setPersons(response.data);
		});
	}, []);

	const addPerson = (event) => {
		event.preventDefault();
		const newPerson = {
			name: newName,
			number: newNumber,
		};

		if (persons.some((p) => p.name === newName)) {
			alert(`${newName} is already added to phonebook!`);
		} else {
			axios
				.post('http://localhost:3001/persons', newPerson)
				.then((response) => {
					setPersons(persons.concat(response.data));
					setNewName('');
					setNewNumber('');
				});
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
