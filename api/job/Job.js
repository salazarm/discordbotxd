const DiscordScraper = require('../../scraper/api/discord');

const fs = require('fs');
const now = require("performance-now");
const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const by = webdriver.By;
const Keys = webdriver.Key;

const chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {args: ['--headless', '--window-size=1920,5080']});
chromeCapabilities.set('timeouts', {
  script: 60000000,
});


class Job  {
  constructor(params) {
    this.params = params;
    this.driver = new webdriver.Builder()
      .forBrowser('chrome')
      .withCapabilities(chromeCapabilities)
      .build();
  }

  async start() {
    const params = this.params;
    const bot = params.bot;
    const driver = this.driver;

    console.log('get login');
    await driver.get('https://discordapp.com/login');
    await driver.wait(webdriver.until.titleContains('Discord'), 10000);
    const emailInput = await driver.findElements(by.xpath("//input[@type='email']"));
      emailInput[0].sendKeys(bot.email);
    const passwordInput = await driver.findElements(by.xpath("//input[@type='password']"));
      passwordInput[0].sendKeys(bot.password);

    const buttonInput = await driver.findElements(by.xpath("//button[@type='submit']"));
    buttonInput[0].click();
    console.log('click');

    const installFn = await DiscordScraper.genInstallFn();
    const messageUsersChannelFn = await DiscordScraper.genMessageChannelUsersFn();

    await driver.executeScript(installFn);
    console.log("driver.executeScript(messageUsersChannelFn, params);");
    const res = await driver.executeAsyncScript(messageUsersChannelFn, params);
    this.assist();
    return res;
  }

  async assist() {
    let exit = false;
    let i = 0;
    while (!exit && ++i) {
      try {
        exit = await this.assistImpl();
        // do nothing if its a script timeout
      } catch (error) {
        console.log("Assist hit error", i, error);
      }
    }
  }

  async assistImpl() {
    const driver = this.driver;
    const receiveAssist = await DiscordScraper.genReceveAssistRequestFn();
    const command = await driver.executeAsyncScript(receiveAssist);
    console.log('got command', command.type);
    if (command.exit) {
      return true;
    }
    if (command.type === 'submit_message') {
      // const input = await driver.findElements(by.xpath(QUICK_INPUT));
      // await input[0].sendKeys(Keys.ENTER);
      const response = await DiscordScraper.genAssistRequestResponseFn();
      driver.executeAsyncScript(
        response,
        {success: true},
      );
    }
    if (command.type === 'screenshot') {
      console.log('took screenshot');
      const screenShot = await driver.takeScreenshot();
      fs.writeFileSync(command.name + '.png', Buffer.from(screenShot, 'base64'));
    }
    return false;
  }
}

module.exports = Job;
