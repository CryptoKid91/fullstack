const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(helper.initialBlogs);
});

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

test('A valid blag can be added ', async () => {
	const newBlog = {
		title: 'Pluralistic',
		author: 'Cory Doctorow',
		url: 'https://pluralistic.net',
		likes: 14,
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
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

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	const addedBlog = blogsAtEnd.find((b) => b.title === newBlog.title);
	expect(addedBlog.likes).toBe(0);
});

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

afterAll(async () => {
	await mongoose.connection.close();
});
