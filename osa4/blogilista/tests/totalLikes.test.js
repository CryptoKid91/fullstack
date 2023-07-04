const { totalLikes } = require('../utils/list_helper');

describe('Total likes', () => {
	test('of empty list is zero', () => {
		expect(totalLikes([])).toBe(0);
	});

	test('when list has only one blogs is thats likes', () => {
		expect(
			totalLikes([
				{
					_id: '64a46fa6de5b8d021fd8f34b',
					title: 'Pluralistic',
					author: 'Cory Doctorow',
					url: 'https://pluralistic.net',
					likes: 4001,
					__v: 0,
				},
			])
		).toBe(4001);
	});

	test('of a bigger list is calculated rigth', () => {
		expect(
			totalLikes([
				{
					_id: '64a46fa6de5b8d021fd8f34b',
					title: 'Pluralistic',
					author: 'Cory Doctorow',
					url: 'https://pluralistic.net',
					likes: 4001,
					__v: 0,
				},
				{
					_id: '64a46fe5de5b8d021fd8f34e',
					title: 'Approaching Pavonis Mons by balloon',
					author: 'Alastair Reynolds',
					url: 'http://approachingpavonis.blogspot.com',
					likes: 3,
					__v: 0,
				},
			])
		).toBe(4004);
	});
});
