// eslint-disable-next-line new-cap
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const error = require('../utils/error');

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('user');
	res.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
	const { body } = req;

	if (!body.title || !body.url) {
		throw error('NoContent', 'Title or URL missing');
	}

	const decodedToken = jwt.verify(req.token, process.env.SECRET);
	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token invalid' });
	}
	const user = await User.findById(decodedToken.id);

	if (!user) {
		return res.status(401).json({ error: 'invalid user' });
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id,
	});

	const result = await blog.save();
	user.blogs = user.blogs.concat(result._id);
	await user.save();

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
