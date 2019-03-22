export default function getMemberScrollContainer() {
  const el = document
    .evaluate(
      "//div[contains(@class,'scroller') and contains(@class, 'members-')]",
      document
    )
    .iterateNext();
  return el;
}
