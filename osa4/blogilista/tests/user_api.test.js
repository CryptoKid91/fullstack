const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const bcrypt = require('bcrypt');
const User = require('../models/user');

describe('when there is initially one user at db', () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({ username: 'root', passwordHash });

		await user.save();
	});

	describe.only('User creation', () => {
		it('succeeds with a fresh username', async () => {
			const usersAtStart = await helper.usersInDb();

			const newUser = {
				username: 'mluukkai',
				name: 'Matti Luukkainen',
				password: 'salainen',
			};

			await api
				.post('/api/users')
				.send(newUser)
				.expect(201)
				.expect('Content-Type', /application\/json/);

			const usersAtEnd = await helper.usersInDb();
			expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

			const usernames = usersAtEnd.map((u) => u.username);
			expect(usernames).toContain(newUser.username);
		});

		it('fails with proper statuscode and message if username already taken', async () => {
			const usersAtStart = await helper.usersInDb();

			const newUser = {
				username: 'root',
				name: 'Superuser',
				password: 'salainen',
			};

			const result = await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
				.expect('Content-Type', /application\/json/);

			expect(result.body.error).toContain(
				'expected `username` to be unique'
			);

			const usersAtEnd = await helper.usersInDb();
			expect(usersAtEnd).toHaveLength(usersAtStart.length);
		});

		it('fails with proper statuscode and message if password is too short', async () => {
			const usersAtStart = await helper.usersInDb();

			const newUser = {
				username: 'newuser',
				name: 'New User jr.',
				password: 'pw',
			};

			const result = await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
				.expect('Content-Type', /application\/json/);

			expect(result.body.error).toContain(
				'Password must be at least 3 characters'
			);

			const usersAtEnd = await helper.usersInDb();
			expect(usersAtEnd).toHaveLength(usersAtStart.length);
		});
	});

	describe('Login', () => {
		it('succeeds with correct credentials', async () => {
			const login = {
				username: 'root',
				password: 'sekret',
			};

			const res = await api.post('/api/login').send(login).expect(200);
			expect(res.body.token).toBeDefined();
		});

		it('fails with 401 if username is wrong', async () => {
			const login = {
				username: 'toor',
				password: 'sekret',
			};

			await api.post('/api/login').send(login).expect(401);
		});

		it('fails with 401 if password is wrong', async () => {
			const login = {
				username: 'root',
				password: 'väärä',
			};

			await api.post('/api/login').send(login).expect(401);
		});
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
