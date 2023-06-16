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

		const person = {
			name: newName,
			number: newNumber,
		};

		if (persons.some((p) => p.name === newName)) {
			if (
				window.confirm(
					`${newName} on jo listassa, haluatko päivittää numeron?`
				)
			) {
				const id = persons.find((p) => p.name === newName).id;
				personsService
					.update(id, person)
					.then((returnedPerson) => {
						setPersons(
							persons.map((p) =>
								p.id !== id ? p : returnedPerson
							)
						);
						setNewName('');
						setNewNumber('');
					})
					.catch(() => {
						alert(`${newName} not found!`);
						setPersons(persons.filter((p) => p.id !== id));
					});
			}
		} else {
			personsService.create(person).then((returnedPerson) => {
				setPersons(persons.concat(returnedPerson));
				setNewName('');
				setNewNumber('');
			});
		}
	};

	const handleNameChange = (event) => setNewName(event.target.value);
	const handleNumberChange = (event) => setNewNumber(event.target.value);
	const handleSearchStringChange = (event) =>
		setSearchString(event.target.value);

	const personsToShow =
		searchString === ''
			? persons
			: persons.filter((p) =>
					p.name.toLowerCase().includes(searchString.toLowerCase())
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
