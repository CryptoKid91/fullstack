import axios from 'axios';
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';

const getAll = () =>
	axios.get(`${baseUrl}/all`).then((response) => response.data);

const getSelected = (country) =>
	axios.get(`${baseUrl}/name/${country}`).then((response) => response.data);

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, getSelected };
