import genCurrentChannelInfo from './genCurrentChannelInfo';
import genFindNext from './genFindNext';
import getGroupOffsets from './getGroupOffsets';
import getMemberScrollContainer from './getMemberScrollContainer'

import logInfo from './logInfo';

export default async function genNextElement(processed, currentGroup) {
  if (!processed.length) {
    // First iteration... use the first div...
    // Skip the div added for lazy scrolling go to index 1.
    console.log(getMemberScrollContainer());
    const next = getMemberScrollContainer().children[1];
    console.log("first," + next.innerHTML);
    return { next: next };
  }
  const prev = processed[processed.length - 1];
  console.log("on prev" + logInfo(prev));

  const name = typeof prev.member === "string" ? prev.member : "";
  const channelInfo = await genCurrentChannelInfo("ONLINE");

  let attempt = 0;
  let next;
  while (attempt++ < 10) {
    try {
      const [startOffset, endOffset] = getGroupOffsets(channelInfo, currentGroup);
      next = await genFindNext(name, startOffset, endOffset);
      break;
    } catch (e) {
      console.log('attempt ' + attempt);
    }
  }

  if (next) {
    return { next: next };
  }
  return { exit: true };
}
