var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuarios');
var bicisRouter = require('./routes/bicicletas');
var bicisAPIRouter = require('./routes/api/bicicletas');
var usersAPIRouter = require('./routes/api/usuarios');
var tokenRouter = require('./routes/token');

var app = express();
var mongoose = require('mongoose');

var mongoDB = 'mongodb://localhost/red_bicicletas'
mongoose.connect(mongoDB,{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db= mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB coneccion error'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/token', tokenRouter);


app.use('/bicicletas', bicisRouter);
app.use('/api/bicicletas', bicisAPIRouter);
app.use('/api/usuarios', usersAPIRouter);

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
  res.render('error');
});

module.exports = app;
