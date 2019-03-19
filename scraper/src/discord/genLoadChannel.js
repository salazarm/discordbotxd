import getChannelLink from './getChannelLink'
import genNextFrame from './genNextFrame'
import genPlaceholdersFinishLoading from './genPlaceholdersFinishLoading'

export default async function genLoadChannel(channel) {
  while (!getChannelLink(channel)) {
    await genNextFrame(500)
  }
  getChannelLink(channel).click()
  await genPlaceholdersFinishLoading()
}
