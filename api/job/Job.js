const fs = require('fs');
const now = require("performance-now");
const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const by = webdriver.By;
const Keys = webdriver.Key;

const messageUsersChannel = require('../../discord-driver/commands/message-users-channel');
const messageUsersChannelAssist = require('../../discord-driver/commands/message-users-channel-assist');
const messageUsersChannelAssistResponse = require('../../discord-driver/commands/message-users-channel-assist-response');

const chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {args: ['--headless', '--window-size=1920,5080']});
chromeCapabilities.set('timeouts', {
  script: 60000000,
});

const QUICK_INPUT =  "//input[contains(@class, 'quickMessage')]";

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

    const res = await driver.executeAsyncScript(
      messageUsersChannel,
      params
    );
    this.assist(driver);
    return res;
  }

  async assist(driver) {
    let exit = false;
    while (!exit) {
      console.log('waiting for command');
      const command = await driver.executeAsyncScript(
        messageUsersChannelAssist
      );
      if (command.exit) {
        break;
      }
      if (command.type === 'submit_message') {
        console.log('submit_message_command');
        const screenShot = await driver.takeScreenshot();
        const input = await driver.findElements(by.xpath(QUICK_INPUT));
        await input[0].sendKeys(Keys.ENTER);
        const screenShot2 = await driver.takeScreenshot();
        driver.executeAsyncScript(
          messageUsersChannelAssistResponse,
          {success: true},
        );
      }
    }
  }
}

module.exports = Job;
