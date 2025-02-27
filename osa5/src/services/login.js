import axios from 'axios';
const baseUrl = '/api/login';

const login = async (credentials) => {
	const response = await axios.post(baseUrl, credentials);
	return response.data;
};

const getLoginStatus = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

const logout = async () => {
	await axios.delete(baseUrl);
};

export const loginService = { login, getLoginStatus, logout };
