import genChannelsLoaded from './genChannelsLoaded'

export default async function genChannels() {
  await genChannelsLoaded()
  const channelLinks = document.evaluate(
    "//a[contains(@href,'/channels/') and not(contains(@href, '@me'))]",
    document
  )
  const channels = []
  let link
  while ((link = channelLinks.iterateNext())) {
    // memory leak?
    channels.push({
      pathname: link.pathname.replace(/(\/[^\/]+\/[^\/]+).*$/, '$1'),
      name: link.getAttribute('aria-label'),
      icon: link.childNodes[0].style.backgroundImage,
    })
  }
  return channels
}
