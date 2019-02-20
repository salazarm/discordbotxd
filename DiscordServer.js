const DiscordDriver = require('./DiscordDriver.js');

const _drivers = {};


async function run(commands) {
  const driverInfo = DiscordDriver.run(commands);
  if (driverInfo.status === 'success') {
    _drivers[driverInfo.id] = driverInfo.driver;
  }
  return {
    id: driverInfo.id,
    status: driverInfo.status,
  };
}

module.exports = {
  async init(server) {
    await DiscordDriver.init(server);
  },

  async run(commands) {
    const status = await run(commands);
    return status;
  },

  shutdown(id) {

  }
};
