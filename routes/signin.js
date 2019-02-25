const {Router} = require('express');

const signinRouter = Router();
module.exports = function(app) {
  app.use('/signin', signinRouter);
  signinRouter.post('/', function(req, res, next) {
    console.log('signin route');
    // TODO: Do Sign in stuff

    // TODO: generate the session ID based of the websocket instance

    console.log('set cookie');

    // if signed in then redirect to dashboards
    res.redirect('/dashboard');
  });
}
