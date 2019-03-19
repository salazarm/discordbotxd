export default function isNodeMemberGroup(node) {
  return (node.getAttribute('class') || '').indexOf('membersGroup') !== -1
}
