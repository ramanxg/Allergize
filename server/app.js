var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// firebase configuration
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyAnA5BzfPyx1sVHCj7TgYVwVdXU33DCs2c",
  authDomain: "nonut-52bd9.firebaseapp.com",
  databaseURL: "https://nonut-52bd9.firebaseio.com",
  projectId: "nonut-52bd9",
  storageBucket: "nonut-52bd9.appspot.com",
  messagingSenderId: "186976534326",
  appId: "1:186976534326:web:2399c9f6e0afad009dfd97"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var allergyRouter = require('./routes/allergies');

var app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/allergies', allergyRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end("Error!");
});

module.exports = app;
