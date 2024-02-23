// server.js or app.js
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');// Import Mongoose

// MongoDB connection string
var mongoDB = 'mongodb://localhost:27017/yunchao';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

// Bind connection to error event to get notification of connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Require your routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/post');
// Initialize express app
var app = express();
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/post',postRouter);

// Export the app
module.exports = app;
