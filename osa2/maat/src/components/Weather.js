import { useState, useEffect } from 'react';
import countriesService from '../services/countries';

const Weather = ({ city, latlon }) => {
	const [weather, setWeather] = useState('');

	useEffect(() => {
		countriesService
			.getWeather(latlon[0], latlon[1])
			.then((initialWeather) => {
				setWeather(initialWeather);
				console.log('Weather:', initialWeather);
			})
			.catch((err) => console.log(err));
	}, [latlon]);

	if (!weather) return null;
	return (
		<div>
			<h2>Weather in {city}</h2>
			Temperature: {weather.main.temp} °C
			<br />
			<img
				src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
				alt={weather.weather[0].description}
				width="100"
			/>
			<br />
			Wind: {weather.wind.speed} m/s
		</div>
	);
};
export default Weather;
