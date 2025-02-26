const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('user', { blogs: 0 });
	res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
	const { title, author, url, likes } = req.body;

	const userRecord = await User.findById(req.uid);
	if (!userRecord) {
		return res.status(401).end();
	}

	const user = userRecord._id;
	const blog = new Blog({ title, author, url, likes, user });

	const result = await blog.save();
	userRecord.blogs = userRecord.blogs.concat(result._id);
	await userRecord.save();

	res.status(201).json(result);
});

blogsRouter.delete('/:id', async (req, res) => {
	const id = req.params.id;
	const blog = await Blog.findById(id);

	if (!blog) {
		res.status(404).end();
	} else if (blog.user.toString() !== req.uid) {
		return res.status(401).end();
	}

	const result = await Blog.findByIdAndDelete(id);

	if (result) {
		const user = await User.findById(result.user);
		user.blogs = user.blogs.filter((bid) => bid.toString() !== id);
		await user.save();

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
