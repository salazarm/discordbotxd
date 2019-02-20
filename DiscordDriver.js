const SocketServer = require('ws').Server;

const fs = require('fs');
const now = require("performance-now");
const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const by = webdriver.By;

const chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {args: ['--headless']});

let wss;

async function run(commands) {
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .build();

  await driver.get('https://discordapp.com/login');
  await driver.wait(webdriver.until.titleContains('Discord'), 10000);
  const status = await driver.executeAsyncScript("setTimeout");
  return status;
}

function stop(){}

function pause() {}

module.exports = {
  init(server) {
    wss = new SocketServer({ server });
    //init Websocket ws and handle incoming connect requests
    wss.on('connection', function connection(ws) {
        console.log("connection ...");
        //on connect message
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });
        ws.send('message from server at: ' + new Date());
    });
  },
  run: run,
  stop: stop,
  pause: pause,
}
