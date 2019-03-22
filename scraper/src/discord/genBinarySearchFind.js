import genPlaceholdersFinishLoading from './genPlaceholdersFinishLoading';
import getMemberScrollContainer from './getMemberScrollContainer';
import getVisibleNodes from './getVisibleNodes';
import { logMessage } from './logger';

function getVisibleHeight() {
  const offsetHeight = getMemberScrollContainer().offsetHeight;
  if (offsetHeight - 100 < 0) {
    return offsetHeight;
  }
  return offsetHeight - 100;
}

export default async function genBinarySearchFind(searchName, lo, hi, deep = 0) {
  const visibleHeight = getVisibleHeight();
  const mid = Math.floor((lo + hi) / 2);
  if (hi - lo <= visibleHeight) {
    logMessage('set lo');
    getMemberScrollContainer().scrollTop = lo;
  } else {
    logMessage('set mid');
    getMemberScrollContainer().scrollTop = mid;
  }
  try {
    await genPlaceholdersFinishLoading();
  } catch (e) {
    throw new Error('Failed to load at scroll position '+ scrollPosition + ' with name: '+searchName);
  }
  logMessage('placeholders finished loading');
  const visibleNodes = getVisibleNodes(lo, hi);
  if (visibleNodes.length === 0) {
    if (mid === hi) {
      logMessage("higher than hi");
      return null;
    }
    if (mid === lo) {
      logMessage("lower then low");
      return null;
    }
  }

  const members = visibleNodes.filter(info => info.member);
  if (!members.length) {
    logMessage("d: ", deep, "s: \"", searchName, "\" lo: ", lo, " hi: ",hi, " v:",getVisibleHeight());
    throw new Error("No visible members in search range");
  }

  const firstMemberName = members[0].member;
  const lastMemberName = members[members.length -1].member;
  if (searchName <= firstMemberName.toLowerCase()) {
    if (hi - lo <= visibleHeight) {
      logMessage('first in view');
      return members[0];
    }
    return await genBinarySearchFind(searchName, lo, mid, deep+1);
  } else if (searchName <= lastMemberName.toLowerCase()) {
    let lastMember = members[0];
    for (let i = 0, l = members.length; i < l; i++) {
      const memberName = members[i].member;
      if (searchName == memberName) {
        logMessage("exact");
        return members[i];
      }
      if (searchName < memberName) {
        if (i === 0) {
          logMessage("i === 0");
        }
        return lastMember;
      }
      lastMember = members[i];
    }
    logMessage('end of the line');
    return lastMember;
  } else {
    if (hi - lo <= visibleHeight) {
      logMessage('last in view');
      return members[members.length - 1];
    }
    return await genBinarySearchFind(searchName, mid + 1, hi, deep+1);
  }
}
