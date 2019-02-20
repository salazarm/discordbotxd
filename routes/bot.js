module.exports = function(app) {
  app.get('/bot', function(req, res, next) {
    // Do Sign in stuff
    // if signed in then redirect to dashboard
    res.json([{
      id: 1,
      username: "samsepi0l"
    }, {
      id: 2,
      username: "D0loresH4ze"
    }]);
  });
}
