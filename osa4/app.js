//const http = require('http');
const { MONGODB_URI } = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const { info, error } = require('./utils/logger');
const mongoose = require('mongoose');
const morgan = require('morgan');

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

app.use(morgan('tiny'));

app.use('/api/blogs', blogsRouter);

module.exports = app;
