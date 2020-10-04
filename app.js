require('dotenv').config();
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
var authAPIrouter = require('./routes/api/auth');

const MongoDBStore = require('connect-mongodb-session')(session);
const jwt = require('jsonwebtoken');

const Usuario = require('./models/usuario');
const token = require('./models/token');

///  para inciar sessiones si trbaja en local con memoria, caso conterario con sesion en servidor
let store;
if (process.env.NODE_ENV === 'develoment'){
  store = new session.MemoryStore; // sesion en memoria
}else{
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });
  store.on('error',function(error){
    assert.ifError(error);
    assert.ok(false);
  });
}


var app = express();
//// codigo para inicio de sesion 
app.set('secretKey', 'alabenalreycarmesi');

app.use(session({
  cookie: {maxage: 240 * 60 * 60 *1000},
  store: store,
  saveuninitialized:true,
  resave:'true',
  secret:'red_bicis_!!!***!*123123'
}));


var mongoose = require('mongoose');
const { assert } = require('console');

//            base de datos de desarrollo
//var mongoDB = 'mongodb://localhost/red_bicicletas'
//            base datos de produccion
var mongoDB = process.env.MONGO_URI;

// contrasñea de admin mongo :WF4XlhBh0FECJkWW
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
      return res.redirect('/index_usuario');
    })
  })(req, res, next);
});

app.get('/index_usuario', function (req, res) {  
  console.log(req.user.nombre);
  res.render('index_usuario',{usuarioName : req.user.nombre});
});

app.get('/forgotPassword', function (req, res) {  
  res.render('sessions/forgotPassword');
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
    app.set('usuario', req.user);
    next(); // si el ussuario existe psa a bicicletas

  } else {
    console.log('Usuario sin loguearse');
    res.redirect('/login');
  }
};

/// funcion q valida es api con el token se debe obtener el token entrando:
//  http://localhost:3000/api/auth/authenticate
// se manda:
// {
//   "email":"lolpruebana@gmail.com",
//   "password":"1"
// }
// devuelve la inforamcion del usuario y 1 token,

// luego se hace el get de bicicletas mandando el token como headers
// http://localhost:3000/api/bicicletas
// x-access-token: token_here

function validarUsuario(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      console.log('Error en validar Usuario');
      res.json({ status: "error", message: err.message, data: null });
    } else {
      console.log('Pasó el usuario: ' + req.body.userId);
      req.body.userId = decoded.id;
      console.log('JWT verify: ' + decoded);
      next();
    }
  });
};
app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/token', tokenRouter);


app.use('/bicicletas',loggedIn, bicisRouter); // se usa loggedIn como middelware para dsar paso a bicicletas

app.use('/api/auth',authAPIrouter);
app.use('/api/bicicletas',validarUsuario ,bicisAPIRouter);
app.use('/api/usuarios', usersAPIRouter);

app.use('/privacy_polity',function(req,res){
  res.sendFile(__dirname +'/public/privacy_polity.html');
});

app.use('/google259399f6cf2a79fe',function(req,res){
  res.sendFile(__dirname +'/public/google259399f6cf2a79fe.html');
});

app.get('/auth/google',
  passport.authenticate('google',{scope:[
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read',
    'https://www.googleapis.com/auth/userinfo.email']})
);

app.get('/auth/google/callback', passport.authenticate('google',{
    successRedirect: '/',
    failureRedirect: '/error'
  })
);


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

function estaLogueado(req, res, next) {
  //req.isAuthenticated viene en passport
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
 }

module.exports = app;
