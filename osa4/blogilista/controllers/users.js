const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const error = require('../utils/error');

usersRouter.get('/', async (req, res) => {
	const users = await User.find({}).populate('blogs');
	res.json(users);
});

usersRouter.post('/', async (req, res, next) => {
	const { username, name, password } = req.body;

	if (!password || password.length < 3) {
		throw error(
			'PasswordInvalid',
			'Password must be at least 3 characters'
		);
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username,
		name,
		passwordHash,
	});

	const savedUser = await user.save();

	res.status(201).json(savedUser);
});

module.exports = usersRouter;
