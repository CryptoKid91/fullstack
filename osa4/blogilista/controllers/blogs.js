// eslint-disable-next-line new-cap
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

const error = (name, message = 'Unspecified error') => {
	const e = new Error(message);
	e.name = name;
	return e;
};

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({});
	res.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
	const { body } = req;

	if (!body.title || !body.url) {
		throw error('NoContent', 'Title or URL missing');
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	});

	const result = await blog.save();
	res.status(201).json(result);
});

blogsRouter.delete('/:id', async (req, res, next) => {
	const result = await Blog.findByIdAndRemove(req.params.id);
	if (result) {
		res.status(204).end();
	} else {
		throw error('NotFound', 'Blog not found');
	}
});

blogsRouter.put('/:id', async (req, res, next) => {
	const { body } = req;

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	};

	const result = await Blog.findByIdAndUpdate(req.params.id, blog, {
		new: true,
		runValidators: true,
	});
	res.json(result);
});

module.exports = blogsRouter;
