var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport'); // sesiones
const session = require('express-session');  //sesiones

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuarios');
var bicisRouter = require('./routes/bicicletas');
var bicisAPIRouter = require('./routes/api/bicicletas');
var usersAPIRouter = require('./routes/api/usuarios');
var tokenRouter = require('./routes/token');

const Usuario = require('./models/usuario');
const token = require('./models/token');

const store = new session.MemoryStore; // sesion en memoria

var app = express();
//// codigo para inicio de sesion 
app.use(session({
  cookie: {maxage: 240 * 60 * 60 *1000},
  store: store,
  saveuninitialized:true,
  resave:'true',
  secret:'red_bicis_!!!***!*123123'
}));

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

app.use(passport.initialize()); /// sesiones
app.use(passport.session()); /// sesiones

app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function(req, res){
  res.render('sessions/login');
});

app.post('/login', function (req, res, next) {  
  passport.authenticate('local', function (err, user, info) {  
    if (err) return next(err);
    if (!user) return res.render('sessions/login', {info});
    req.login(user, function (err) {  
      if (err) return next(err);
      return res.redirect('/');
    })
  })(req, res, next);
});

app.get('/logout', function (req, res) {  
  req.logout();
  res.redirect('/');
});
app.get('/forgotPassword', function (req, res) {  
  res.render('sessions/forgotPassword');
});

app.post('/forgotPassword', function (req, res) {  
  Usuario.findOne({ email: req.body.email }, function(err, user) {
    if (!user) return res.render('sessions/forgotPassword', { info: { message: 'No existe el email para un usuario existente' } });
    console.log('ent');
    user.resetPassword(function(err) {
      console.log('ent..');
      if (err) return next(err);
      console.log('sessions/forgotPasswordMessage');
    });
    
    res.render('sessions/forgotPasswordMessage');
  });
});

app.get('/resetPassword/:token', function(req, res, next) {
  console.log(req.params.token);
  token.findOne({ token: req.params.token }, function(err, token) {
    if(!token) return res.status(400).send({ msg: 'No existe un usuario asociado al token, verifique que su token no haya expirado' });
    Usuario.findById(token._userId, function(err, user) {
      if(!user) return res.status(400).send({ msg: 'No existe un usuario asociado al token.' });
      res.render('sessions/resetPassword', {errors: { }, user: user});
    });
  });
});

app.post('/resetPassword', function(req, res) {
  if(req.body.password != req.body.confirm_password) {
    res.render('sessions/resetPassword', {errors: {confirm_password: {message: 'No coincide con el password ingresado'}}, user: new Usuario({email: req.body.email})});
    return;
  }
  Usuario.findOne({email: req.body.email}, function(err, user) {
    user.password = req.body.password;
    user.save(function(err) {
      if(err) {
        res.render('sessions/resetPassword', {errors: err.errors, user: new Usuario({email: req.body.email})});
      } else {
        res.redirect('/login');
      }
    });
  });
});

function loggedIn(req, res, next) {
  if(req.user) {
    next(); // si el ussuario existe psa a bicicletas
    
  } else {
    console.log('Usuario sin loguearse');
    res.redirect('/login');
  }
};

app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/token', tokenRouter);


app.use('/bicicletas',loggedIn, bicisRouter); // se usa loggedIn como middelware para dsar paso a bicicletas
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
