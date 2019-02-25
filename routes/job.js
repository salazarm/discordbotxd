const {Router} = require('express');

const jobRouter = Router();
module.exports = function(app) {
  app.use('/job', jobRouter);
  jobRouter.post('/', function(req, res, next) {
    const {excludedGroups, message, messageDelay, pathname} = req.params;
    console.log(excludedGroups, message, messageDelay, pathname);
  });
}
