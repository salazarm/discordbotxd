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

const defaultFn = getFnBody(() => {
  console.log('installed');
  if (arguments && arguments[0]) {
    argument[0]();
  }
});

const DiscordScraperAPI = {
  async genInstallFn(fn) {
    const module = await readModuleFile('../dist/discord.js')
    return module + "\n" + (fn || defaultFn);
  },

  async genChannelsFn() {
    const fn = () => {
      const Driver = window.document.lemmeinyouwilllose;
      const nodeRes = arguments[0];
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
    const fn = () => {
      console.log('genMessageChannelUsersFn');
      const [config, nodeRes] = arguments;
      const Driver = window.document.lemmeinyouwilllose;
      Driver.genMessageChannelUsers(config, nodeRes);
    }
    return getFnBody(fn);
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
