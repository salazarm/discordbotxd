export default async function getMemberScrollContainer() {
  return document
    .evaluate(
      "//div[contains(@class,'scroller') and contains(@class, 'members-')]",
      document
    )
    .iterateNext();
}
