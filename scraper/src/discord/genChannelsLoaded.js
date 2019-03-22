import genNextFrame from "./genNextFrame";
import { logMessage } from "./logger";

export default async function genChannelsLoaded() {
  await new Promise(async (res, rej) => {
    const id = setInterval(async () => {
      const channel = document
        .evaluate(
          "//a[contains(@href,'/channels/') and not(contains(@href, '@me'))]",
          document
        )
        .iterateNext()
      if (channel) {
        logMessage('channels loaded')
        clearInterval(id)
        await genNextFrame(1000)
        res()
      }
      logMessage('waiting for channels')
    }, 1000)
  })
}
