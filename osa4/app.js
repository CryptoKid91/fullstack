const { MONGODB_URI } = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const { info, error } = require('./utils/logger');
const mongoose = require('mongoose');
const morgan = require('morgan');
const errorHandler = require('./utils/errorHandler');

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		info('Connected to MongoDB');
	})
	.catch((e) => {
		error(`Error connecting to MongoDB: ${e.message}`);
	});

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('tiny'));
}

app.use('/api/blogs', blogsRouter);

app.use(errorHandler);

module.exports = app;
