const fs = require('fs')

async function readModuleFile(path, callback) {
  return new Promise((res, rej) => {
    try {
      var filename = require.resolve(path)
      fs.readFile(filename, 'utf8', res)
    } catch (e) {
      rej(e)
    }
  })
}

const DiscordScraperAPI = {
  async genInstall(token, email, password, nodeRes) {
    const module = await readModuleFile('../dist/discord.js')
    const fn = async function(token, email, password, nodeRes) {
      '%Module'
      const Driver = window.document.lemmeinyouwilllose
      Driver.setInfo({ token, email, password })
      const channels = await Driver.genChannels()
      nodeRes(channels)
    }
    return fn.toString().replace("'%Module'", module)
  },
}

module.exports = DiscordScraperAPI
