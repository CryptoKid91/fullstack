import { useState, useEffect } from 'react';
import countriesService from '../services/countries';

const Details = ({ country }) => {
	const [selectedCountry, setSelectedCountry] = useState('');

	useEffect(() => {
		countriesService
			.getSelected(country)
			.then((responseCountry) => setSelectedCountry(responseCountry))
			.catch((err) => console.log(err));
	}, [country]);

	if (!selectedCountry) {
		return <div>Country not found!</div>;
	}

	console.log(
		`Meillä on maa, ja se on tämä: ${country}. Sitä eustaa olio:`,
		selectedCountry
	);

	return (
		<div>
			<h1>{selectedCountry.name.common}</h1>
			Capital: {selectedCountry.capital}
			<br />
			Area: {selectedCountry.area} km²
			<br />
			<h3>Languages:</h3>
			<ul>
				{Object.values(selectedCountry.languages).map((l) => (
					<li key={l}>{l}</li>
				))}
			</ul>
			<br />
			<img
				src={selectedCountry.flags.svg}
				alt={`Flag of ${selectedCountry.name.common}`}
				width="320"
				heigth="196"
			/>
		</div>
	);
};
export default Details;
