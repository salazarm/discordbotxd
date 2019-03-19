export default async function genBinarySearchFind(searchName, lo, hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (hi - lo > WINDOW_HEIGHT - 1000) {
    getMemberScrollContainer().scrollTop = mid;
    console.log("set mid");
  } else {
    getMemberScrollContainer().scrollTop = lo;
    console.log("set lo");
  }
  await placeholdersFinishLoading();
  const visibleNodes = getVisibleNodes(lo, hi);
  if (visibleNodes.length === 0) {
    if (mid === hi) {
      console.log("higher than hi");
      return null;
    }
    if (mid === lo) {
      console.log("lower then low");
      return null;
    }
  }

  const members = visibleNodes.filter(info => info.member);
  if (!members.length) {
    console.log("no members searchName" + searchName);
  }

  const firstMemberName = members[0].member;
  const lastMemberName = members[members.length -1].member;
  if (searchName < firstMemberName.toLowerCase()) {
    if (lo === mid || hi - lo < WINDOW_HEIGHT - 1000) {
      return members[0];
    }
    const newMid = members[0].node.getClientRects()[0].top
    return await genBinarySearchFind(searchName, lo, mid - 1);
  } else if (searchName <= lastMemberName.toLowerCase()) {
    let lastMember;
    for (let i = 0, l = members.length; i < l; i++) {
      const memberName = members[i].member;
      if (searchName == memberName) {
        console.log("exact");
        return members[i];
      }
      if (searchName < memberName) {
        if (i === 0) {
          console.log("i === 0");
          alert("hi");
          return genBinarySearchFind(lo - 420, mid);
        }
        return lastMember;
      }
      lastMember = members[i];
    }
    return lastMember;
  } else {
    if (hi === mid || hi - lo < WINDOW_HEIGHT - 1000) {
      return members[members.length - 1];
    }
    return await genBinarySearchFind(searchName, mid + 1, hi);
  }
}
