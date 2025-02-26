const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({ username });
	const passwordCorrect =
		user === null
			? false
			: await bcrypt.compare(password, user.passwordHash);

	if (!(user && passwordCorrect)) {
		return res.status(401).json({
			error: 'invalid username or password',
		});
	}

	const userForToken = {
		username: user.username,
		id: user._id,
	};

	const token = jwt.sign(userForToken, process.env.SECRET);

	res.status(200)
		.cookie('access_token', token, {
			httpOnly: true,
		})
		.json({ username: user.username, name: user.name });
});

loginRouter.get('/', async (req, res) => {
	const user = await User.findById(req.uid);
	if (user) {
		return res
			.status(200)
			.json({ username: req.username, name: user.name });
	} else {
		return res.status(401).end();
	}
});

loginRouter.delete('/', (req, res) => {
	return res.clearCookie('access_token').status(204).end();
});

module.exports = loginRouter;
