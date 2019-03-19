export default function getMemberGroupPlaceholder() {
  return document
    .evaluate("//div[contains(@class, 'memberGroupsPlaceholder')]", document)
    .iterateNext()
}
