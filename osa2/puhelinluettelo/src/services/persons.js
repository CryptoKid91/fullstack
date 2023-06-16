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

const create = (newObject) =>
	axios.post(baseUrl, newObject).then((response) => response.data);

const remove = (id) =>
	axios.delete(`${baseUrl}/${id}`).then((response) => response.data);

const update = (id, newObject) =>
	axios.put(`${baseUrl}/${id}`, newObject).then((response) => response.data);

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, remove, update };
