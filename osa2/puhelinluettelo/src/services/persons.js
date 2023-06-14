import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
	//return axios.get(baseUrl).then((response) => response.data);
	const nonExisting = {
		name: 'Lucifer Aamutähti',
		number: '040-123456',
		id: 666,
	};
	return axios
		.get(baseUrl)
		.then((response) => response.data.concat(nonExisting));
};

const create = (newObject) => {
	return axios.post(baseUrl, newObject).then((response) => response.data);
};

const remove = (id) => {
	return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, remove };
