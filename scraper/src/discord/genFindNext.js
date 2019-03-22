import genBinarySearchFind from "./genBinarySearchFind";
import { logMessage } from "./logger";

export default async function genfindNext(
  searchName,
  startOffset = 0,
  endOffset
) {
  searchName = searchName.toLowerCase();
  if (startOffset && endOffset) {
    logMessage('startOffset:', startOffset, 'endtOffset:', endOffset);
    const last = await genBinarySearchFind(searchName, startOffset, endOffset);
    return last.node.nextSibling;
  }
  logMessage("no start/end");
}
