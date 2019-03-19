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
    const fn = function install(token, email, password, nodeRes) {
      console.log('in');
      console.log(email);
      // const Driver = window.document.lemmeinyouwilllose
      // Driver.setInfo({ token, email, password })
      // Driver.genChannels().then(result => {
        nodeRes({});
      // });
    }
    return fn.toString().replace("'%Module'", module)
  },
}

module.exports = DiscordScraperAPI
