// se necesita varias librerias
// passport
// passport-local
// express-session

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookTokenStrategy = require('passport-facebook-token');

passport.use(new localStrategy (
    function(email, password, done) {
        Usuario.findOne({ email: email }, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Email no existe o es incorrecto.' });
            if (!user.validPassword(password)) return done(null, false, { message: 'Password incorrecto' });

            return done(null, user);
        });
    }
));

passport.serializeUser(function(user,cb){
    cb(null,user.id);
});

passport.deserializeUser(function(id, cb) {
    Usuario.findById(id, function(err, user) {
        cb(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST+"/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      Usuario.findOneOrCreatebyGoogle(profile, function (err, user) {
        return cb(err, user);
      });
  }
));

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
  },
  function(accessToken, refreshToken, profile, done) {
      try{
        Usuario.findOneOrCreatebyFacebook(profile, function (err, user) {
            if (err) console.log('error' + err);
            console.log(user);
            return done(err, user);
        });        
      }catch(err2){
        console.log(err2);
        return done(err2, null);
    }            
  }
));

module.exports = passport;