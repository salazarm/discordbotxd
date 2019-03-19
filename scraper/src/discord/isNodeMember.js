export default async function isNodeMember(node) {
  return (node.getAttribute('class') || '').indexOf('memberOnline') !== -1
}
