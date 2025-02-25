const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({});
	res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
	const blog = new Blog(req.body);

	const result = await blog.save();
	res.status(201).json(result);
});

blogsRouter.delete('/:id', async (req, res) => {
	const result = await Blog.findByIdAndDelete(req.params.id);

	if (result) {
		res.status(204).end();
	} else {
		res.status(404).end();
	}
});

blogsRouter.put('/:id', async (req, res) => {
	const { title, author, url, likes } = req.body;

	const updatedBlog = await Blog.findByIdAndUpdate(
		req.params.id,
		{ title, author, url, likes },
		{ new: true, runValidators: true, context: 'query' }
	);
	if (updatedBlog) {
		res.json(updatedBlog);
	} else {
		res.status(404).end();
	}
});

module.exports = blogsRouter;
