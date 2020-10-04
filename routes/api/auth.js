var express = require('express');
const passport = require('passport');
var router = express.Router();
var authController = require('../../controllers/api/authcontrollerAPI');

router.post('/authenticate', authController.authenticate);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/facebook_token', passport.authenticate('facebook-token'), authController.authFacebookToken);

module.exports = router;