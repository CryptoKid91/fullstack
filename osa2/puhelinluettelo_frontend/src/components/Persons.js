import Person from './Person';

const Persons = ({ persons, remove }) => {
	return (
		<ul>
			{persons.map((person) => (
				<Person
					key={person.id}
					person={person}
					remove={() => remove(person.id)}
				/>
			))}
		</ul>
	);
};
export default Persons;
