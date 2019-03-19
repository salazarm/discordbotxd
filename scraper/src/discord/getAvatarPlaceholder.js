export default function getAvatarPlaceholder() {
  return document
    .evaluate("//div[contains(@class, 'placeholderAvatar')]", document)
    .iterateNext()
}
