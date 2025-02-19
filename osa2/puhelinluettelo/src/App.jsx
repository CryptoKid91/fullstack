import { useState, useEffect } from 'react';
import * as personService from './services/persons';
import './index.css';

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

const Notification = ({ notification: { message, className } }) => {
	if (message === null) {
		return null;
	}

	return <div className={className}>{message}</div>;
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filterTerm, setFilterTerm] = useState('');
	const [notification, setNotification] = useState({
		message: '',
		className: '',
	});

	useEffect(() => {
		personService.getAll().then((response) => {
			setPersons(response);
		});
	}, []);

	const notify = (notification, type, timeout = 5000) => {
		setNotification({ message: notification, className: type });
		setTimeout(() => {
			setNotification({ message: '' });
		}, timeout);
	};

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
					notify(`${response.name} updated succesfully`, 'notice');
				});
			}
		} else {
			personService.create(newPerson).then((response) => {
				setPersons(persons.concat(response));
				setNewName('');
				setNewNumber('');
				notify(`${response.name} added succesfully`, 'notice');
			});
		}
	};

	const filteredPersons = persons.filter((p) =>
		p.name.toLowerCase().includes(filterTerm.toLowerCase())
	);

	const handleClick = (id) => () => {
		const name = persons.find((p) => p.id === id).name;

		if (window.confirm(`Do you want to delete ${name}?`)) {
			personService.remove(id).then((response) => {
				setPersons(persons.filter((p) => p.id !== id));
				notify(`${name} deleted`, 'error');
			});
		}
	};

	return (
		<div>
			<h1>Phonebook</h1>
			<Notification notification={notification} />
			<Filter filterTerm={filterTerm} setFilterTerm={setFilterTerm} />
			<PersonForm
				{...{ addPerson, newName, setNewName, newNumber, setNewNumber }}
			/>
			<Persons {...{ filteredPersons, handleClick }} />
		</div>
	);
};

export default App;
