const Person = ({ person, remove }) => {
	return (
		<li>
			{person.name} {person.number}{' '}
			<button onClick={remove}>Delete</button>
		</li>
	);
};
export default Person;
