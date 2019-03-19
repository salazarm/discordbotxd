const fs = require('fs')
const path = require('path');

async function readModuleFile(filepath, callback) {
  return new Promise((res, rej) => {
    try {
      const fullpath = path.join(__dirname, filepath);
      fs.readFile(fullpath, 'utf8', (error, content) => {
        if (error) {
          rej(error);
        } else {
          res(content.toString());
        }
      })
    } catch (e) {
      console.log('rejected');
      rej(e)
    }
  })
}

const DiscordScraperAPI = {
  async genInstallFn() {
    const module = await readModuleFile('../dist/discord.js')
    const fn = function install() {
      '%Module';
      const [token, email, password, nodeRes] = arguments;
      const Driver = window.lemmeinyouwilllose;
      Driver.setInfo({ token, email, password });
      Driver.genChannels().then(result => {
        nodeRes(result);
      });
    }
    return fn
      .toString()
      .match(/function[^{]+\{([\s\S]*)\}$/)[1]
      .replace("'%Module'", module);
  },
}

module.exports = DiscordScraperAPI
