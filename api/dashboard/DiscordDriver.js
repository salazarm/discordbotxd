const DiscordScraper = require('../../scraper/api/discord');
const SocketServer = require('ws').Server;

const crypto = require('crypto');
const fs = require('fs');
const now = require("performance-now");
const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const by = webdriver.By;

const prefs = new webdriver.logging.Preferences();
prefs.setLevel(webdriver.logging.Type.BROWSER, webdriver.logging.Level.ALL);
prefs.setLevel(webdriver.logging.Type.CLIENT, webdriver.logging.Level.ALL);
prefs.setLevel(webdriver.logging.Type.DRIVER, webdriver.logging.Level.ALL);
prefs.setLevel(webdriver.logging.Type.SERVER, webdriver.logging.Level.ALL);


const chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {args: ['--headless', '--window-size=1920,5080']});
chromeCapabilities.set('timeouts', {
  script: 60000,
});
chromeCapabilities.setLoggingPrefs(prefs);
webdriver.logging.installConsoleHandler();
let wss;

let _driversByToken = {};
let _driversByUser = {};

class Driver {
  constructor(token, user) {
    this.id = token;
    this.bots = user.bots;
    this.user = user;
    this.botDrivers = {};
    this.state = {};
    _driversByToken[token] = this;
    _driversByUser[user.id] = this;
  }

  async start() {
    const bots = [];
    this.settingUp = Promise.all(this.bots.map(async (bot) => {
      const driver = new webdriver.Builder()
        .forBrowser('chrome')
        .withCapabilities(chromeCapabilities)
        .build();

      await driver.get('https://discordapp.com/login');
      await driver.wait(webdriver.until.titleContains('Discord'), 10000);
      const emailInput = await driver.findElements(by.xpath("//input[@type='email']"));
        emailInput[0].sendKeys(bot.email);
      const passwordInput = await driver.findElements(by.xpath("//input[@type='password']"));
        passwordInput[0].sendKeys(bot.password);

      const buttonInput = await driver.findElements(by.xpath("//button[@type='submit']"));
      buttonInput[0].click();

      const getChannelsFn = await DiscordScraper.genChannelsFn();
      const installFn = await DiscordScraper.genInstallFn(getChannelsFn);
      const channels = await driver.executeAsyncScript(installFn);
      this.botDrivers[bot.email] = driver;
      bots.push({
        email: bot.email,
        channels,
      });
    }));
    await this.settingUp;
    this.state = {
      bots,
      jobs: [],
    };
    return ({
      bots,
      jobs: [],
    });
  }

  async getBotChannels(bot) {
    const driver = this.botDrivers[bot.email];
    const getChannelsFn = await DiscordScraper.genChannelsFn();
    return await driver.executeAsyncScript(
      getChannelsFn,
      this.id,
      bot.email,
      bot.password,
    );
  }

  async getChannelInfo(dashboardId, channel) { 
    if (this.settingUp) {
      await this.settingUp;
    }
    const driver = this.botDrivers[dashboardId];
    if (driver) {
      let info;
      try {
        const getChannelInfoFn = await DiscordScraper.genChannelInfo();
        info = await driver.executeAsyncScript(
          getChannelInfoFn,
          channel
        );
      } catch (e) {
        console.log('error', e);
        return {memberGroups: ['Server Timed Out']};
      }
      return info;
    }
  }

  getState() {
    return this.state;
  }

  destroy() {
    delete _driversByToken[this.id];
  }
}

function onConnection(ws) {
  console.log("connection ...");
  //on connect message
  ws.on('message', function incoming(message) {
      console.log('received: %s', message);
  });
  ws.send('message from server at: ' + new Date());
}

let hasInit = false;
module.exports = {
  init(server) {
    if (!hasInit) {
      hasInit = true;
      wss = new SocketServer({ server });
      //init Websocket ws and handle incoming connect requests
      wss.on('connection', onConnection);
    }
  },

  async start(user) {
    const token = await new Promise((res) => {
      crypto.randomBytes(48, function(err, buffer) {
        res(buffer.toString('hex'));
      });
    });
    const driver = new Driver(token, user);
    return await driver.start();
  },

  async getChannelInfo(user, dashboardId, channelPath) {
    console.log('getChannelInfo');
    const driver = await this.getOrCreate(user);
    console.log('got driver');
    const info = await driver.getChannelInfo(dashboardId, channelPath);
    console.log('got info', info);
    return info;
  },

  async getBotChannels(user, botEmail) {
    const driver = await this.getOrCreate(user);
    const bot = user.bots.find(bot => bot.email === botEmail);
    return await driver.getBotChannels(bot);
  },

  get(user) {
    return _driversByUser[user.id];
  },

  async getOrCreate(user) {
    if (_driversByUser[user.id]) {
      return _driversByUser[user.id];
    }
    await this.start(user);
    return _driversByUser[user.id];
  }
}
