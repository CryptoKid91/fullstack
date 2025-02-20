const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('give password as argument');
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://marcostalfors:${password}@puhelinluettelo.a62lf.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=puhelinluettelo`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', noteSchema);

let filter = {};
switch (process.argv.length) {
	default:
		console.log(
			`Extra arguments ${process.argv.slice(5).join(' ')} ignored`
		);
	case 5:
		const newPerson = new Person({
			name: process.argv[3],
			number: process.argv[4],
		});
		newPerson.save().then((result) => {
			console.log(
				`Added ${result.name} with number ${result.number} to phonebook`
			);
			mongoose.connection.close();
		});
		break;
	case 4:
		filter.name = process.argv[3];
	case 3:
		Person.find(filter).then((result) => {
			console.log('Phonebook:');
			result.forEach((p) => {
				console.log(`${p.name} ${p.number}`);
			});
			mongoose.connection.close();
		});
}
