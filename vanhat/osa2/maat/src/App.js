import { useState, useEffect } from 'react';

import countriesService from './services/countries';
import Details from './components/Details';

const App = () => {
	const [searchString, setSearchString] = useState('');
	const [countries, setCountries] = useState([]);
	const [countriesToShow, setCountriesToShow] = useState([]);

	useEffect(() => {
		countriesService.getAll().then((initialCountries) => {
			setCountries(initialCountries);
			setCountriesToShow(initialCountries);
		});
	}, []);

	const handleSearchStringChange = (event) => {
		setSearchString(event.target.value);
		setCountriesToShow(
			countries.filter((e) =>
				e.name.common
					.toLowerCase()
					.includes(event.target.value.toLowerCase())
			)
		);
	};

	const showCountry = (name) => () => {
		console.log(`Nappia painetu maan ${name} kohdalla`);
		setCountriesToShow(
			countries.filter((e) =>
				e.name.common.toLowerCase().includes(name.toLowerCase())
			)
		);
	};

	return (
		<div>
			Find countries:{' '}
			<input value={searchString} onChange={handleSearchStringChange} />
			<ul>
				{countriesToShow.length > 10 ? (
					<li>Too many countries</li>
				) : countriesToShow.length > 1 ? (
					countriesToShow.map((e) => (
						<li key={e.name.common}>
							{e.name.common}
							<button onClick={showCountry(e.name.common)}>
								Show
							</button>
						</li>
					))
				) : (
					<Details country={countriesToShow[0]?.name.common} />
				)}
			</ul>
		</div>
	);
};

export default App;
