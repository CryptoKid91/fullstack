import { useState, useEffect } from 'react';
import axios from 'axios';

import PersonFrom from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [searchString, setSearchString] = useState('');

	useEffect(() => {
		axios.get('http://localhost:3001/persons').then((response) => {
			setPersons(response.data);
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
			id: persons.length + 1,
		};
		setPersons(persons.concat(person));
		setNewName('');
		setNewNumber('');
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
			<Persons persons={personsToShow} />
		</div>
	);
};

export default App;
