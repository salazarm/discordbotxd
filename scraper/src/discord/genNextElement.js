import genCurrentChannelInfo from './genCurrentChannelInfo';
import genFindNext from './genFindNext';
import getGroupOffsets from './getGroupOffsets';
import getMemberScrollContainer from './getMemberScrollContainer'
import { logMessage } from "./logger";
import logInfo from './logInfo';

export default async function genNextElement(processed, currentGroup) {
  if (!processed.length) {
    // First iteration... use the first div...
    // Skip the div added for lazy scrolling go to index 1.
    logMessage(getMemberScrollContainer());
    const next = getMemberScrollContainer().children[1];
    logMessage("first,", next.innerHTML);
    return { next: next };
  }
  const prev = processed[processed.length - 1];
  logMessage("on prev" + logInfo(prev));

  const name = typeof prev.member === "string" ? prev.member : "";
  logMessage('genCurrentChannelInfo');
  const channelInfo = await genCurrentChannelInfo("ONLINE");

  let attempt = 0;
  let next;
  while (attempt++ < 10) {
    logMessage('attempt ', attempt);
    try {
      const [startOffset, endOffset] = getGroupOffsets(channelInfo, currentGroup);
      next = await genFindNext(name, startOffset, endOffset);
      break;
    } catch (e) {
      logMessage(e.message);
    }
  }

  if (next) {
    return { next: next };
  }
  return { exit: true };
}
