import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const getAll = () => {
	const request = axios.get(baseUrl);
	return request.then((response) => response.data);
};

const setToken = (newToken) => {
	token = `Bearer ${newToken}`;
	console.log(token);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken };
