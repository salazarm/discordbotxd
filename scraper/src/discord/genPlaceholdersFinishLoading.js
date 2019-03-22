import getAvatarPlaceholder from './getAvatarPlaceholder';
import getMemberGroupPlaceholder from './getMemberGroupPlaceholder';
import getMemberScrollContainer from './getMemberScrollContainer';
import genNextFrame from './genNextFrame';
import { logMessage } from "./logger";

export default async function genPlaceholdersFinishLoading() {
  await genNextFrame(60);
  let ap = getAvatarPlaceholder();
  let ms = getMemberScrollContainer();
  let gp = getMemberGroupPlaceholder();
  let start = performance.now();
  let lastLog = start;
  let add = 3;
  while (ap || !ms || !ms.children || !ms.children.length  || gp) {
    const now = performance.now();
    if (now - start > 30000) {
      if (ap) {
        throw new Error('AvatarPlaceholder still visible after 30 seconds');
      }
      if (!ms) {
        throw new Error('MemberScrollContainer missing after 30 seconds');
      }
      if (!ms.children || !ms.children.length) {
        throw new Error('MemberScrollContainer unknown children after 30 seconds');
      }
      if (gp) {
        throw new Error('GroupPlaceholder still visible after 30 seconds');
      }
      throw new Error('Failed to load channel');
    }
    if (ms) {
      if (lastLog - now > 1000) {
        logMessage('attempting to move scroll');
        lastLog = now;
      }
      add *= -1;
      ms.scrollTop += add;
    }
    await genNextFrame(50);
    ap = getAvatarPlaceholder();
    ms = getMemberScrollContainer();
    gp = getMemberGroupPlaceholder();
  }
}
