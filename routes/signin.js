var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.post('/signin', function(req, res, next) {
    // Do Sign in stuff
    // if signed in then redirect to dashboard
    res.redirect('/dashboard');
  });
}
