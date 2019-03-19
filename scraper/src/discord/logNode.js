import getUserName from "./getUserName";

export default function logNode(node) {
  if (node) {
    return getUserName(node) || node.innerText;
  }
  return "<no node>";
}
