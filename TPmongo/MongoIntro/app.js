const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// MongoDb and ENV File Configuration 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


// Routes 
const indexRouter = require('./routes/index');
const errorController = require('./controllers/errorController');
const jsonRouter = require('./routes/json');
const taskRouter = require('./routes/taskRouter');


const app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/json', jsonRouter);
// API pour les tasks 
app.use('/task', taskRouter);

// catch 404 and forward to error handler
app.use(errorController.notFound);

// error handler
app.use(errorController.errorHandler);

// Connect to Mongo Database

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database, listening on port ' + process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
