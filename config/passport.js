// se necesita varias librerias
// passport
// passport-local
// express-session

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');
const GoogleStrategy = require('passport-google-oauth20');

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

module.exports = passport;