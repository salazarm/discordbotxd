export default function getUserName(node) {
  if (node instanceof Node) {
    const name = document
      .evaluate(".//span[contains(@class, 'usernameOnline')]", node)
      .iterateNext();
    if (name) {
      return name.innerHTML.toLowerCase();
    }
  }
}
