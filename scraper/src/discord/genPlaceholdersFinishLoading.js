import getAvatarPlaceholder from './getAvatarPlaceholder';
import getMemberGroupPlaceholder from './getMemberGroupPlaceholder';
import getMemberScrollContainer from './getMemberScrollContainer';
import genNextFrame from './genNextFrame';
import { logMessage } from "./logger";

export default async function genPlaceholdersFinishLoading() {
  await genNextFrame(100);
  let ap = getAvatarPlaceholder();
  let ms = getMemberScrollContainer();
  let gp = getMemberGroupPlaceholder();
  let start = performance.now();
  let lastLog = start;
  let add = 0.1;
  while (ap || ! ms  || gp) {
    const now = performance.now();
    if (now - start > 30000) {
      if (ap) {
        logMessage('AvatarPlaceholder still visible after 30 seconds');
      }
      if (!ms) {
        logMessage('MemberScrollContainer missing after 30 seconds');
      }
      if (!ms.children || !ms.children.length) {
        logMessage('MemberScrollContainer unknown children after 30 seconds');
      }
      if (gp) {
        logMessage('GroupPlaceholder still visible after 30 seconds');
      }
      throw new Error('Failed to load channel');
    }
    if (ms) {
      if (now - lastLog > 1000) {
        logMessage('attempting to move scroll ' + add);
        lastLog = now;
      }
      getMemberScrollContainer().scrollTop += add;
    }
    await genNextFrame(1000);
    ap = getAvatarPlaceholder();
    ms = getMemberScrollContainer();
    gp = getMemberGroupPlaceholder();
  }
}
