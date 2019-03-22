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

    await driver.get('https://discordapp.com/login');
    await driver.wait(webdriver.until.titleContains('Discord'), 10000);
    const emailInput = await driver.findElements(by.xpath("//input[@type='email']"));
      emailInput[0].sendKeys(bot.email);
    const passwordInput = await driver.findElements(by.xpath("//input[@type='password']"));
      passwordInput[0].sendKeys(bot.password);

    const buttonInput = await driver.findElements(by.xpath("//button[@type='submit']"));
    buttonInput[0].click();

    const messageUsersChannelFn = await DiscordScraper.genMessageChannelUsersFn();
    console.log('messageUsersChannel with:', params);
    const res = await driver.executeAsyncScript(
      messageUsersChannelFn,
      params
    );
    this.assist(driver);
    return res;
  }

  async assist(driver) {
    let exit = false;
    while (!exit) {
      try {
        exit = await this.assistImpl();
        // do nothing if its a script timeout
      } catch (error) {
        console.log("Assist hit error", error);
      }
    }
  }

  async assistImpl() {
    console.log('waiting for command');
    const receiveAssist = await DiscordScraper.genReceveAssistRequestFn();
    const command = await driver.executeAsyncScript(receiveAssist);
    if (command.exit) {
      return true;
    }
    if (command.type === 'submit_message') {
      console.log('submit_message_command');
      // const input = await driver.findElements(by.xpath(QUICK_INPUT));
      // await input[0].sendKeys(Keys.ENTER);
      const response = await DiscordScraper.genAssistRequestResponseFn();
      driver.executeAsyncScript(
        messageUsersChannelAssistResponse,
        {success: true},
      );
    }
    if (command.type === 'screenshot') {
      console.log('took screenshot');
      const screenShot = await driver.takeScreenshot();
      fs.writeFileSync(command.name + '.png', new Buffer(screenShot, 'base64'));
    }
  }
}

module.exports = Job;
