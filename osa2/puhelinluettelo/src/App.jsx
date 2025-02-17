import { useState, useEffect } from 'react';
import * as personService from './services/persons';

const Person = ({ person, handleClick }) => {
	return (
		<li>
			{person.name}&nbsp;{person.number}&nbsp;
			<button onClick={handleClick}>Delete</button>
		</li>
	);
};

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

const Persons = ({ filteredPersons, handleClick }) => (
	<div>
		<h2>Numbers</h2>
		<ul>
			{filteredPersons.map((person) => (
				<Person
					key={person.id}
					person={person}
					handleClick={handleClick(person.id)}
				/>
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
		personService.getAll().then((response) => {
			setPersons(response);
		});
	}, []);

	const addPerson = (event) => {
		event.preventDefault();
		const newPerson = {
			name: newName,
			number: newNumber,
		};

		let oldName = persons.find((p) => p.name === newName);

		if (oldName) {
			if (
				window.confirm(
					`${newName} is already added to phonebook, replace old number?`
				)
			) {
				personService.update(oldName.id, newPerson).then((response) => {
					setPersons(
						persons.map((p) => (p.id == oldName.id ? response : p))
					);
					setNewName('');
					setNewNumber('');
				});
			}
		} else {
			personService.create(newPerson).then((response) => {
				setPersons(persons.concat(response));
				setNewName('');
				setNewNumber('');
			});
		}
	};

	const filteredPersons = persons.filter((p) =>
		p.name.toLowerCase().includes(filterTerm.toLowerCase())
	);

	const handleClick = (id) => () => {
		if (
			window.confirm(
				`Do you want to delete ${
					persons.find((p) => p.id === id).name
				}?`
			)
		) {
			personService
				.remove(id)
				.then(setPersons(persons.filter((p) => p.id !== id)));
		}
	};

	return (
		<div>
			<h1>Phonebook</h1>
			<Filter filterTerm={filterTerm} setFilterTerm={setFilterTerm} />
			<PersonForm
				{...{ addPerson, newName, setNewName, newNumber, setNewNumber }}
			/>
			<Persons {...{ filteredPersons, handleClick }} />
		</div>
	);
};

export default App;
