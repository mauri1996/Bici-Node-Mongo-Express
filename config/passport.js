// se necesita varias librerias
// passport
// passport-local
// express-session

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');

passport.use(new localStrategy(

));

passport.serializeUser(function(user,cb){
    cb(null,user.id);
});

passport.deserializeUser(function(user,cb){
    Usuario.findById(id,function(err,usuario){
        cb(err,usuario);
    });
});

module.exports = passport;