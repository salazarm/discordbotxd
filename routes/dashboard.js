const { Router } = require('express');

const Dashboard = require('../api/dashboard/dashboard');

const hardcodedUser = {
  id: 1,
  name: 'test',
  bots: [{
    email: 'salazarm93@gmail.com',
    password: '1234567890bot',
  }],
};

const dashboardRouter = Router();
const channelRouter = Router({ mergeParams: true });

module.exports = function(app) {
  app.use('/dashboard', dashboardRouter);
  dashboardRouter.use('/:dashboardId/channel', channelRouter);

  dashboardRouter.get('/', async function(req, res, next) {
    const dashboard = await Dashboard.get(hardcodedUser);
    res.json({ ...dashboard });
  });

  dashboardRouter.get('/:botEmail', async function(req, res, next) {
    const botEmail = req.params.botEmail;
    const channels = await Dashboard.getBotChannels(hardcodedUser, botEmail);
    res.json(channels);
  });

  channelRouter.get('/', async function(req, res, next) {
    const dashboard = await Dashboard.get(hardcodedUser);
    res.json({ ...dashboard });
  });

  channelRouter.get('/:channel', async function(req, res, next) {
    const info =
      await Dashboard.getChannelInfo(
        hardcodedUser,
        req.params.dashboardId,
        req.params.channel
      );
    res.json(info);
  });
}
