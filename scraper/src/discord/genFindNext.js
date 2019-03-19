import genBinarySearchFind from "./genBinarySearchFind";

export default async function genfindNext(
  searchName,
  startOffset = 0,
  endOffset
) {
  searchName = searchName.toLowerCase();
  if (startOffset && endOffset) {
    const last = await genBinarySearchFind(searchName, startOffset, endOffset);
    return last.node.nextSibling;
  }
  console.log("no start/end");
}
