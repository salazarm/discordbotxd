import genBinarySearchFind from "./genBinarySearchFind";
import { logMessage } from "./logger";

export default async function genfindNext(
  searchName,
  startOffset = 0,
  endOffset,
  guess,
) {
  searchName = searchName.toLowerCase();
  if (startOffset && endOffset) {
    const last = await genBinarySearchFind(searchName, startOffset, endOffset, 0, guess);
    return last.node.nextSibling;
  }
  logMessage("no start/end");
}
