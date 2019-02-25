const DiscordDriver = require('./DiscordDriver.js');

module.exports = {
  async startServerForUser(user) {
    // TODO: Move to memcache when we scale to a million users
    const driver = DiscordDriver.get(user);
    if (driver) {
      if (driver.settingUp) {
        await driver.settingUp;
      }
      return driver.getState();
    }
    return await DiscordDriver.start(user);
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
