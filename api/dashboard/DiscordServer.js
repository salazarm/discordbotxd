const DiscordDriver = require('./DiscordDriver.js');

const settingUp = {};

module.exports = {
  async startServerForUser(user) {
    // TODO: Move to memcache when we scale to a million users
    if (settingUp[user.id]) {
      return await settingUp[user.id];
    }
    const driver = DiscordDriver.get(user);
    if (driver) {
      return driver.getState();
    }
    settingUp[user.id] = DiscordDriver.start(user);
    const data = await settingUp[user.id];
    delete settingUp[user.id]
    return data;
  },

  async getBotChannels(user, botEmail) {
    return await DiscordDriver.getBotChannels(user, botEmail);
  },

  async getChannelInfo(user, dashboardId, channel) {
    return await DiscordDriver.getChannelInfo(
      user,
      dashboardId,
      channel,
    );
  }
};
