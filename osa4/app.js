const { MONGODB_URI } = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const { info, error } = require('./utils/logger');
const mongoose = require('mongoose');
const morgan = require('morgan');
const usersRouter = require('./controllers/users');
const errorHandler = require('./utils/errorHandler');
const cookieParser = require('cookie-parser');
const loginRouter = require('./controllers/login');
const authorization = require('./utils/authorization');

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		info('Connected to MongoDB');
	})
	.catch((e) => {
		error(`Error connecting to MongoDB: ${e.message}`);
	});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(authorization);

if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('tiny'));
}

app.use('/api/blogs', blogsRouter);

app.use('/api/users', usersRouter);

app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testing');
	app.use('/api/testing', testingRouter);
}

app.use(errorHandler);

module.exports = app;
