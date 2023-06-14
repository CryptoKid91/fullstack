import { useState, useEffect } from 'react';

import personsService from './services/persons';
import PersonFrom from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [searchString, setSearchString] = useState('');

	useEffect(() => {
		personsService.getAll().then((initialPersons) => {
			setPersons(initialPersons);
		});
	}, []);

	const addPerson = (event) => {
		event.preventDefault();
		if (persons.some((e) => e.name === newName)) {
			alert(`${newName} on jo listassa`);
			return;
		}

		const person = {
			name: newName,
			number: newNumber,
		};

		personsService.create(person).then((returnedPerson) => {
			setPersons(persons.concat(returnedPerson));
			setNewName('');
			setNewNumber('');
		});
	};

	const handleNameChange = (event) => setNewName(event.target.value);
	const handleNumberChange = (event) => setNewNumber(event.target.value);
	const handleSearchStringChange = (event) =>
		setSearchString(event.target.value);

	const personsToShow =
		searchString === ''
			? persons
			: persons.filter((e) =>
					e.name.toLowerCase().includes(searchString.toLowerCase())
			  );

	const remove = (id) => {
		const name = persons.find((i) => i.id === id).name;
		if (window.confirm(`Delete ${name} from database?`)) {
			personsService
				.remove(id)
				.catch(() => {
					alert(` ${name} has already been deleted from database`);
				})
				.finally(setPersons(persons.filter((p) => p.id !== id)));
		}
	};

	return (
		<div>
			<h1>Phonebook</h1>
			Filter with:{' '}
			<input value={searchString} onChange={handleSearchStringChange} />
			<h2>Add a new</h2>
			<PersonFrom
				onSubmit={addPerson}
				onNameChange={handleNameChange}
				onNumberChange={handleNumberChange}
				nameValue={newName}
				numberValue={newNumber}
			/>
			<h2>Numbers</h2>
			<Persons persons={personsToShow} remove={remove} />
		</div>
	);
};

export default App;
