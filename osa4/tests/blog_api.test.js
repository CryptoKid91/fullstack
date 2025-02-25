const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./testHelper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(helper.initialBlogs);
});

describe('When getting blogs', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs');
		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test('a specific blog is within the returned blogs', async () => {
		const response = await api.get('/api/blogs');

		const titles = response.body.map((r) => r.title);
		expect(titles).toContain('Approaching Pavonis Mons by balloon');
	});
});

describe('When adding a blog', () => {
	test('a valid blog is added to database', async () => {
		const newBlog = {
			title: 'A test blog',
			author: 'Tester',
			url: 'www.example.com',
			likes: 42,
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		const titles = blogsAtEnd.map((r) => r.title);
		expect(titles).toContain('A test blog');
	});

	test('a blog without title is not added', async () => {
		const newBlog = {
			author: 'Tester',
			url: 'www.example.com',
			likes: 42,
		};

		await api.post('/api/blogs').send(newBlog).expect(400);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
