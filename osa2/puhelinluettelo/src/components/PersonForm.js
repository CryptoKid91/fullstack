const PersonForm = ({
	onSubmit,
	onNameChange,
	onNumberChange,
	nameValue,
	numberValue,
}) => {
	return (
		<form onSubmit={onSubmit}>
			<div>
				Name: <input value={nameValue} onChange={onNameChange} />
				<br />
				Number: <input value={numberValue} onChange={onNumberChange} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};
export default PersonForm;
