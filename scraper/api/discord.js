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

function getFnBody(fn) {
  return fn
    .toString()
    .match(/[^{]+\{([\s\S]*)\}$/)[1];
}

const DiscordScraperAPI = {
  async genInstallFn() {
    const module = await readModuleFile('../dist/discord.js')
    const genChannelsFn = await DiscordScraperAPI.genChannelsFn();
    return module + "\n" + genChannelsFn;
  },

  async genChannelsFn() {
    const fn = () => {
      const Driver = window.document.lemmeinyouwilllose;
      const [token, email, password, nodeRes] = arguments;
      Driver.setInfo({token, email, password });
      Driver.genChannels().then(result => {
        nodeRes(result);
      });
    }
    return getFnBody(fn);
  },

  async genChannelInfo() {
    const fn = () => {
      const Driver = window.document.lemmeinyouwilllose;
      const [channel, nodeRes] = arguments;
      Driver.genChannelInfo(channel).then(result => {
        nodeRes(result);
      });
    }
    return getFnBody(fn);
  },

  async genMessageChannelUsersFn() {
    const module = await readModuleFile('../dist/discord.js')
    const fn = () => {
      const [config, nodeRes] = arguments;
      const Driver = window.document.lemmeinyouwilllose;
      Driver.genMessageChannelUsers(config, nodeRes)
    }
    return module + "\n" + getFnBody(fn);
  },

  async genReceveAssistRequestFn() {
    const fn = () => {
      const nodeRes = arguments[0];
      const Driver = window.document.lemmeinyouwilllose;
      Driver.Assist.genServerReceiveAssist(nodeRes);
    }
    return getFnBody(fn);
  },

  async genAssistRequestResponseFn() {
    const fn = () => {
      const [response, nodeRes] = arguments;
      const Driver = window.document.lemmeinyouwilllose;
      Driver.Assist.genServerAssistResponse(response, nodeRes);
    }
    return getFnBody(fn);
  },
}

module.exports = DiscordScraperAPI
