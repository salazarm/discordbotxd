export default function getChannelLink(channel) {
  return document
    .evaluate("//a[contains(@href, '" + channel + "')]", document)
    .iterateNext()
}
