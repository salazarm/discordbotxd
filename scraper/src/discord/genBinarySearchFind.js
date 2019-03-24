import genGoToScrollTopSlowly from './genGoToScrollTopSlowly';
import genPlaceholdersFinishLoading from './genPlaceholdersFinishLoading';
import { genRequestAssist } from './Assist';
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

export default async function genBinarySearchFind(
  searchName,
  lo,
  hi,
  deep = 0,
  guess = null
) {
  const visibleHeight = getVisibleHeight();
  const mid = Math.floor((lo + hi) / 2);
  if (hi - lo <= visibleHeight || hi > guess && lo < guess) {
    logMessage('set lo ' + lo);
    await genGoToScrollTopSlowly(lo);
  } else if (guess) {
    logMessage('set guess ', + guess);
    await genGoToScrollTopSlowly(guess);
  } else {
    logMessage('set mid ' + mid);
    await genGoToScrollTopSlowly(mid);
  }
  try {
    await genPlaceholdersFinishLoading();
  } catch (e) {
    console.log('request ErrorInGenPLaceholdersFinishLoading');
    await genRequestAssist({
      type: 'screenshot',
      name: 'error'
    });
    console.log('requested');
    throw new Error('Failed to load at lo: '+lo + ' hi: ' + hi  + ' with name: '+searchName);
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
    const first = members[0];
    if (hi - lo <= visibleHeight || guess === lo) {
      logMessage('first in view');
      return first;
    }
    const newTop = first.top;
    return await genBinarySearchFind(searchName, lo, newTop, deep+1);
  } else if (searchName <= lastMemberName.toLowerCase()) {
    let lastMember = members[0];
    for (let i = 0, l = members.length; i < l; i++) {
      const memberName = members[i].member;
      if (searchName == memberName) {
        logMessage("exact ", members[i].top, " ",guess, " ", guess ? Math.abs(members[i].top - guess) : 'none');
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
    const last = members[members.length - 1];
    if (hi - lo <= visibleHeight) {
      logMessage('last in view');
      return last;
    }
    return await genBinarySearchFind(searchName, last.top, hi, deep+1);
  }
}
