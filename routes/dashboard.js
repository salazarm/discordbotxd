var express = require('express');
var router = express.Router();

module.exports = function(app) {
  app.get('/dashboard', function(req, res, next) {
    // Do Sign in stuff
    // if signed in then redirect to dashboard
    res.json({
      dashboard: {
      	bots: [{
          name: 'testbot',
          id: 4,
        }],
        jobs: [],
      }
    });
  });
}
