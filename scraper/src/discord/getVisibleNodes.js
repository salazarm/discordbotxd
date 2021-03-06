import getMemberScrollContainer from "./getMemberScrollContainer";
import getUserName from "./getUserName";
import isNodeMember from "./isNodeMember";
import isNodeMemberGroup from "./isNodeMemberGroup";

export default function getVisibleNodes(min = 0, max = Infinity) {
  const msc = getMemberScrollContainer();
  const mscTop = msc.getClientRects()[0].top;
  const nodes = Array.prototype.slice.call(msc.children);
  const visibleNodes = [];
  for (let i = 0, l = nodes.length; i < l; i++) {
    const node = nodes[i];
    const rect = node.getClientRects()[0];
    let top = rect.top + msc.scrollTop - mscTop;
    if (top < min) {
      continue;
    } else if (top > max) {
      break;
    }
    if (isNodeMember(node)) {
      visibleNodes.push({
        node: node,
        member: getUserName(node),
        top: top,
      });
    } else if (isNodeMemberGroup(node)) {
      visibleNodes.push({
        node: node,
        group: node.innerText,
        top: top,
      });
    }
  }
  return visibleNodes;
}
