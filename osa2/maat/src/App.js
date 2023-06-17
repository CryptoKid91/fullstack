import { useState, useEffect } from 'react';

import countriesService from './services/countries';
import Details from './components/Details';

const App = () => {
	const [searchString, setSearchString] = useState('');
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		countriesService
			.getAll()
			.then((initialCountries) => setCountries(initialCountries));
	}, []);

	const handleSearchStringChange = (event) =>
		setSearchString(event.target.value);

	const countriesToShow = countries.filter((e) =>
		e.name.common.toLowerCase().includes(searchString.toLowerCase())
	);
	console.log(countriesToShow);

	return (
		<div>
			Find countries:{' '}
			<input value={searchString} onChange={handleSearchStringChange} />
			<ul>
				{countriesToShow.length > 10 ? (
					<li>Too many countries</li>
				) : countriesToShow.length > 1 ? (
					countriesToShow.map((e) => (
						<li key={e.name.common}>{e.name.common}</li>
					))
				) : (
					<Details country={countriesToShow[0]?.name.common} />
				)}
			</ul>
		</div>
	);
};

export default App;
