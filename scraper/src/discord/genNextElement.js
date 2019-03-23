import genCurrentChannelInfo from './genCurrentChannelInfo';
import genFindNext from './genFindNext';
import getGroupOffsets from './getGroupOffsets';
import getMemberScrollContainer from './getMemberScrollContainer'
import { logMessage } from "./logger";
import logInfo from './logInfo';

let same = 0;
export default async function genNextElement(processed, currentGroup) {
  const prev = processed.length ? processed[processed.length - 1] : {};
  logMessage("on prev", processed.length, logInfo(prev), currentGroup);

  const name = typeof prev.member === "string" ? prev.member : "";
  const channelInfo = await genCurrentChannelInfo("ONLINE");
  const beforePrev = processed.length > 1 ? processed[processed.length - 2] : {};

  if (prev.member && beforePrev.member && prev.member === beforePrev.member) {
    same ++
  } else {
    same = 0;
  }

  let attempt = 0;
  let next;
  while (attempt++ < 10) {
    try {
      const [startOffset, endOffset] = getGroupOffsets(channelInfo, currentGroup);
      const guess = prev.top ? prev.top : startOffset + 41 * processed.length;
      next = await genFindNext(name, startOffset, endOffset, guess);
      let copy = same;
      while (copy-- > 0) {
        logMessage('same', same, name)
        if (!next.nextSibling) {
          getMemberScrollContainer().scrollTop += 300;
          await genPlaceholdersFinishLoading();
          if (!next.nextSibling) {
            // IMPOSSIBRU?!?!?!?!
            throw new Error("No next sibling after same??");
          }
        }
        next = next.nextSibling;
      }
      break;
    } catch (e) {
      logMessage('genNextElement failed attempt', e.message);
      if (attempt === 10) {
        throw e;
      }
    }
  }

  if (next) {
    return { next: next };
  }
  return { exit: true };
}
