import axios from 'axios';
const baseUrl = '/api/login';

export const login = async (credentials) => {
	const response = await axios.post(baseUrl, credentials);
	return response.data;
};

export const getLoginStatus = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

export const logout = async () => {
	await axios.delete(baseUrl);
};
