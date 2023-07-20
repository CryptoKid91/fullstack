const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(helper.initialBlogs);

	await User.deleteMany({});
	const passwordHash = await bcrypt.hash('salainen', 10);
	const user = new User({ username: 'mluukkai', passwordHash });
	await user.save();
});

describe('Blogs are returned correctly', () => {
	test('Blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('There are right amount of blogs', async () => {
		const response = await api.get('/api/blogs');
		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test('Blog has id-field', async () => {
		const response = await api.get('/api/blogs');
		expect(response.body[0].id).toBeDefined();
	});
});

describe('When adding a new blog', () => {
	test('A valid blag can be added ', async () => {
		const newBlog = {
			title: 'Pluralistic',
			author: 'Cory Doctorow',
			url: 'https://pluralistic.net',
			likes: 14,
		};

		const login = {
			username: 'mluukkai',
			password: 'salainen',
		};
		const res = await api.post('/api/login').send(login).expect(200);
		const token = res.body.token;

		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `Bearer ${token}`)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		const titles = blogsAtEnd.map((b) => b.title);
		expect(titles).toContain('Pluralistic');
	});

	test('A blog without likes gets 0 likes', async () => {
		const newBlog = {
			title: 'Pluralistic',
			author: 'Cory Doctorow',
			url: 'https://pluralistic.net',
		};

		const login = {
			username: 'mluukkai',
			password: 'salainen',
		};
		const res = await api.post('/api/login').send(login).expect(200);
		const token = res.body.token;

		await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `Bearer ${token}`)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		const addedBlog = blogsAtEnd.find((b) => b.title === newBlog.title);
		expect(addedBlog.likes).toBe(0);
	});

	describe('Invalid blog is not added', () => {
		test('A blog without title is not added', async () => {
			const newBlog = {
				author: 'Cory Doctorow',
				url: 'https://pluralistic.net',
			};

			await api.post('/api/blogs').send(newBlog).expect(400);

			const blogsAtEnd = await helper.blogsInDb();
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
		});

		test('A blog without URL is not added', async () => {
			const newBlog = {
				title: 'Pluralistic',
				author: 'Cory Doctorow',
			};

			await api.post('/api/blogs').send(newBlog).expect(400);

			const blogsAtEnd = await helper.blogsInDb();
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
		});

		test('Adding blog without token results in 401', async () => {
			const newBlog = {
				title: 'Pluralistic',
				author: 'Cory Doctorow',
				url: 'https://pluralistic.net',
				likes: 14,
			};

			await api
				.post('/api/blogs')
				.send(newBlog)
				.expect(401)
				.expect('Content-Type', /application\/json/);

			const blogsAtEnd = await helper.blogsInDb();
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
		});
	});
});

describe('Removing a blog', () => {
	test('Suceeds if id is valid', async () => {
		// First we need to add a blog to delete it
		const newBlog = {
			title: 'Ephemeral',
			author: 'Soon T. B. Deleted',
			url: 'https://example.com',
			likes: 0,
		};

		const login = {
			username: 'mluukkai',
			password: 'salainen',
		};
		const res = await api.post('/api/login').send(login).expect(200);
		const token = res.body.token;

		const result = await api
			.post('/api/blogs')
			.send(newBlog)
			.set('Authorization', `Bearer ${token}`)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAtStart = await helper.blogsInDb();

		await api
			.delete(`/api/blogs/${result.body.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

		const titles = blogsAtEnd.map((r) => r.title);

		expect(titles).not.toContain(result.body.title);
	});

	test('Fails with 404 if id is invalid', async () => {
		const invalidID = await helper.nonExistingId();
		await api.delete(`/api/blogs/${invalidID}`).expect(404);
	});
});

describe('Updating a blog', () => {
	test('Succesfully updates title', async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];
		blogToUpdate.title = 'A Better Title';

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blogToUpdate)
			.expect(200);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

		const titles = blogsAtEnd.map((r) => r.title);

		expect(titles).toContain(blogToUpdate.title);
	});

	test('Succesfully updates URL', async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];
		blogToUpdate.url = 'A Better URL';

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blogToUpdate)
			.expect(200);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

		const urls = blogsAtEnd.map((r) => r.url);

		expect(urls).toContain(blogToUpdate.url);
	});

	test('Succesfully updates author', async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];
		blogToUpdate.author = 'A Better Author';

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blogToUpdate)
			.expect(200);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

		const author = blogsAtEnd.map((r) => r.author);

		expect(author).toContain(blogToUpdate.author);
	});

	test('Succesfully updates likes', async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];
		blogToUpdate.likes = 9001;

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blogToUpdate)
			.expect(200);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

		const likes = blogsAtEnd.map((r) => r.likes);

		expect(likes).toContain(blogToUpdate.likes);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
