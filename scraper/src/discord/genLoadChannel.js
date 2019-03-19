import getChannel from './getChannel'
import nextFrame from './nextFrame'
import placeholdersFinishLoading from './placeholdersFinishLoading'

export default async function genLoadChannel(channel) {
  while (!getChannelLink(channel)) {
    await nextFrame(500)
  }
  getChannelLink(channel).click()
  await placeholdersFinishLoading()
}
