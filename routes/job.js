const {Router} = require('express');

const Job = require('../api/job/Job');

const jobRouter = Router();
module.exports = function(app) {
  app.use('/job', jobRouter);
  jobRouter.post('/', async function(req, res, next) {
    const {includedGroups, message, messageDelay, pathname} = req.body;
    console.log('body', req.body);
    const job = new Job({
      includedGroups,
      message,
      messageDelay,
      pathname,
      bot: {
        email: 'salazarm93@gmail.com',
        password: '1234567890bot',
      },
    });
    return await job.start();
  });
}
