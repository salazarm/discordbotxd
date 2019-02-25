const DiscordServer = require('./DiscordServer.js');

class Dashboard {
  static async get(user) {
    const data = await DiscordServer.startServerForUser(user);
    return data;
  }

  static async getBotChannels(user, botEmail) {
    return await DiscordServer.getBotChannels(user, botEmail);
  }

  static async getChannelInfo(user, dashboardId, channel) {
    const data =
      await DiscordServer.getChannelInfo(user, dashboardId, channel);
    return data;
  }
}

module.exports = Dashboard;
