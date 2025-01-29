import axios from 'axios';
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?';
const api_key = process.env.REACT_APP_API_KEY;

const getAll = () =>
	axios.get(`${baseUrl}/all`).then((response) => response.data);

const getSelected = (country) =>
	axios.get(`${baseUrl}/name/${country}`).then((response) => response.data);

const getWeather = (latitude, longitude) =>
	axios
		.get(
			`${weatherUrl}lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`
		)
		.then((response) => response.data);

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, getSelected, getWeather };
