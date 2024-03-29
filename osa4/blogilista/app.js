const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const { info, error } = require('./utils/logger');

mongoose.set('strictQuery', false);
info('connecting to', config.MONGODB_URI);

const mongoUrl = config.MONGODB_URI;
mongoose
	.connect(mongoUrl)
	.then(() => {
		info('Connected to MongoDB');
	})
	.catch((err) => {
		error('Error connection to MongoDB:', err.message);
	});

app.use(cors());
app.use(express.json());

app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
