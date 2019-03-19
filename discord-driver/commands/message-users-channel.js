module.exports = async function op(params, res) {
  const WINDOW_HEIGHT = 5080;
  const {
    excludedGroups,
    message,
    messageDelay,
    pathname
  } = params;

  let lastMessageTS = 0;

  async function nextFrame(timer) {
    return await new Promise((res, rej) => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          res();
        }, timer ? timer : 30)
      })
    });
  }

  async function getCurrentChannelInfo(end) {
    const seen = {};
    const memberGroups = [];
    const memberScrollContainer = getMemberScrollContainer();
    memberScrollContainer.scrollTop = 0;
    memberScrollContainer.scrollTop = 10;
    await nextFrame();
    memberScrollContainer.scrollTop = 0;
    await nextFrame();
    let scrollTop = 0;
    const height = memberScrollContainer.offsetHeight;
    const contentHeight = memberScrollContainer.scrollHeight;
    let lastGroup = null;
    do {
      // get member groups
      const memberGroupSpans = document.evaluate(
        "//div[contains(@class,'membersGroup')]",
        document,
      );
      let group;
      let exit = false;
      while(group = memberGroupSpans.iterateNext()) {
        let name = group.innerText;
        if (!seen[name]){
          seen[name] = true;
          const [groupName, userCount] = name.split('—');
          lastGroup = {
            name: groupName,
            userCount: parseInt(userCount),
          };
          memberGroups.push(lastGroup);
          if (groupName.includes('ONLINE')) {
            exit = true;
            break;
          }
        }
      }

      if (exit) {
        break;
      }

      if (lastGroup) {
        scrollTop += (lastGroup.userCount * 42 * 0.98 - height / 2);
        lastGroup = null;
      } else {
        scrollTop += (height * 0.75);
      }
      scrollTop = Math.min(scrollTop, contentHeight - height);
      getMemberScrollContainer().scrollTop = scrollTop;
      await placeholdersFinishLoading();
    } while (scrollTop < contentHeight - height);
    getMemberScrollContainer().scrollTop = 0;
    await placeholdersFinishLoading();
    return {
      memberGroups: memberGroups,
    };
  }

  function getAvatarPlaceholder() {
    return document.evaluate(
      "//div[contains(@class, 'placeholderAvatar')]",
      document
    ).iterateNext();
  }

  function getMemberScrollContainer() {
    return document.evaluate(
      "//div[contains(@class,'scroller') and contains(@class, 'members-')]",
      document
    ).iterateNext();
  }

  function getMemberGroupPlaceholder() {
    return document.evaluate(
      "//div[contains(@class, 'memberGroupsPlaceholder')]",
      document,
    ).iterateNext();
  }

  function getChannelLink(channel) {
    return document.evaluate(
      "//a[contains(@href, '"+ channel +"')]",
      document
    ).iterateNext();
  }

  async function loadChannel(channel) {
    while (!getChannelLink(channel)) {
      await nextFrame(500);
    }
    getChannelLink(channel).click();
    await placeholdersFinishLoading();
  }

  async function placeholdersFinishLoading() {
    await nextFrame(500);
    let ap = getAvatarPlaceholder();
    let ms = getMemberScrollContainer();
    let gp = getMemberGroupPlaceholder();
    let start = performance.now()
    while((ap || !ms || gp)) {
      if (performance.now() - start > 30000) {
        throw new Error('Failed to load channel');
      }
      if (ms) {
        ms.scrollTop += 1;
      }
      await nextFrame(1000);
      ap = getAvatarPlaceholder();
      ms = getMemberScrollContainer();
      gp = getMemberGroupPlaceholder();
    }
  }

  async function scrollMemberListDown(distance) {
    ms = getMemberScrollContainer();
    ms.scrollTop += distance;
    await nextFrame();
    await placeholdersFinishLoading();
  }

  function isNodeMemberGroup(node) {
    return (node.getAttribute('class') || '').indexOf('membersGroup') !== -1
  }

  function isNodeMember(node) {
    return (node.getAttribute('class') || '').indexOf('memberOnline') !== -1
  }

  async function getEstimatedUsers() {
    const channelInfo = await getCurrentChannelInfo();
    const memberGroups = channelInfo.memberGroups;
    return memberGroups.reduce(
      (acc, group) => {
        if (excludedGroups.indexOf(group.name) === -1) {
          acc += group.userCount;
        }
        return acc;
      },
      0
    );
  }

  async function messageUser(userDiv) {
    let contextMenu;
    let _start = performance.now();
    do {
      const e = userDiv.ownerDocument.createEvent('MouseEvents');
      e.initMouseEvent(
        'contextmenu',
        true, true,
        userDiv.ownerDocument.defaultView,
        1, 0, 0, 0, 0,
        false, false, false, false, 2, null
      );
      userDiv.dispatchEvent(e);
      await nextFrame(300);
      if (_start - performance.now() > 12000) {
        console.log('stuck waiting on ctx');
      }
    } while (!(
      contextMenu =
        document
          .evaluate("//div[contains(@class, 'contextMenu')]", document)
          .iterateNext()
    ))
    const messageButton  =
      document
        .evaluate(".//span[contains(., 'Message')]", contextMenu)
        .iterateNext();

    try {
      new Promise((res) => {
        res();
        messageButton.click();
      });
    } catch(e) {
      console.log('Error pressing messageButton');
      return;
    }

    let input;
    while (!(
      input =
        document
        .evaluate("//textarea[contains(@placeholder, 'Message')]", document)
        .iterateNext()
    )) {
      await nextFrame(60);
    }

    while (performance.now() - lastMessageTS < messageDelay - 2500) {
      await nextFrame(60);
    }
    await nextFrame(Math.random() * 5000);
    lastMessageTS = performance.now();
    input.value = message;
    console.log('requesting assist for' + getUserName(userDiv));
    // await getAssist({type: 'submit_message', input: input});
    // await confirmMessageSent();
  }

  async function getAssist(options) {
    if (window.d13cfsua) {
      const assist = await window.d13cfsua(options);
      return assist;
    }
    return await new Promise((res) => {
      window.d13cfsua = async function(fn) {
        delete window.d13cfsua;
        const result = await fn(options);
        res(result);
      }
    });
  }



  let runStart;
  let realStart;
  const processed = [];
  async function run() {
    _bail_completely_ = false;
    runStart = performance.now();
    const seenMembers = {};
    let currentGroup = '';

    await loadChannel(pathname);
    getMemberScrollContainer().scrollTop = 0;
    await placeholdersFinishLoading();
    realStart = performance.now();

    let responsedWithEstimatedTime = false;
    while (true) {
      if (processed.filter(f => f.member).length === 10) {
        res({
          timePerMessage: Math.ceil((performance.now() - realStart)/1000),
        });
      }

      if (_bail_completely_) {
        return;
      }
      let {next, end} = await getNext(processed, currentGroup);
      if (_bail_completely_) {
        return;
      }
      if (!next) {
        console.log('no next');
        return;
      }
      if (end) {
        break;
      }

      if (isNodeMemberGroup(next)) {
        currentGroup = next.innerText.split('—')[0];
        if (currentGroup === 'OFFLINE') {
          console.log('complete');
          break;
        }
        console.log('now ' + currentGroup);
        processed.push({
          group: currentGroup,
        });
      } else if (isNodeMember(next)) {
        if (excludedGroups.indexOf(currentGroup) === -1) {
          await messageUser(next);
          await loadChannel(pathname);
        } else {
        }
        processed.push({
          member: getUserName(next),
        });
      }
    }
    console.log('finished processing' + processed.length);
  }

  async function getNext(processed, currentGroup) {
    if (!processed.length) {
      // First iteration... use the first div...
      // Skip the div added for lazy scrolling go to index 1.
      const next = getMemberScrollContainer().children[1];
      console.log('first,'+next.innerHTML);
      return {next: next};
    }
    const prev = processed[processed.length - 1];
    console.log('on prev'+ logInfo(prev));

    const name = typeof prev.member === 'string' ? prev.member :  "";
    const channelInfo = await getCurrentChannelInfo('ONLINE');
    const [startOffset, endOffset] = getGroupOffsets(channelInfo, currentGroup);
    const next = await findNext(name, startOffset, endOffset);

    if (next) {
      return {next: next};
    }
    return {exit: true};
  }

  const GROUP_HEIGHT = 40;
  const MEMBER_HEIGHT = 42;
  function getGroupOffsets(channelGroupInfo, group) {
    const groups = channelGroupInfo.memberGroups;
    let offset = 0;
    let startOffset = 0;
    let endOffset = 0;
    for (let i = 0, l = groups.length; i < l; i++) {
      offset += GROUP_HEIGHT;
      startOffset = offset;
      offset += (MEMBER_HEIGHT * groups[i].userCount);
      endOffset = offset;
      if (groups[i].name === group) {
        return [startOffset, endOffset];
      }
    }
    return [startOffset, endOffset];
  }

  async function findNext(searchName, startOffset = 0, endOffset) {
    searchName = searchName.toLowerCase();
    if (startOffset && endOffset) {
      const last = await binarySearchFind(searchName, startOffset, endOffset);
      return last.node.nextSibling;
    }
    console.log('no start/end');
  }

  async function binarySearchFind(searchName, lo, hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hi - lo > WINDOW_HEIGHT - 1000) {
      getMemberScrollContainer().scrollTop = mid;
      console.log('set mid')
    } else {
      getMemberScrollContainer().scrollTop = lo;
      console.log('set lo');
    }
    await placeholdersFinishLoading();
    const visibleNodes = getVisibleNodes(lo, hi);
    if (visibleNodes.length === 0) {
      if (mid === hi) {
        console.log('higher than hi');
        return null;
      }
      if (mid === lo) {
        console.log('lower then low');
        return null;
      }
    }

    const members = visibleNodes.filter(info => info.member);
    if (!members.length) {
      console.log('no members searchName' +searchName);
    }

    const firstMemberName = members[0].member;
    const lastMemberName = members[members.length -1].member;
    if (searchName < firstMemberName.toLowerCase()) {
      if (lo === mid || hi - lo < WINDOW_HEIGHT - 1000) {
        return members[0];
      }
      const newMid = members[0].node.getClientRects()[0].top
      return await binarySearchFind(searchName, lo, mid - 1);
    } else if (searchName <= lastMemberName.toLowerCase()) {
      let lastMember;
      for (let i = 0, l = members.length; i < l; i++) {
        const memberName = members[i].member;
        if (searchName == memberName) {
          console.log('exact');
          return members[i];
        }
        if (searchName < memberName) {
          if (i === 0) {
            console.log('i === 0');
            alert('hi');
            return binarySearchFind(lo - 420, mid);
          }
          return lastMember;
        }
        lastMember = members[i]
      }
      return lastMember;
    } else {
      if (hi === mid || hi - lo < WINDOW_HEIGHT - 1000) {
        return members[members.length - 1];
      }
      return await binarySearchFind(searchName, mid + 1, hi);
    }
  }

  function getVisibleNodes(min = 0, max = Infinity) {
    const msc = getMemberScrollContainer();
    const mscTop = msc.getClientRects()[0].top;
    const nodes = Array.prototype.slice.call(msc.children);
    const visibleNodes = [];
    for (let i=0, l=nodes.length; i<l; i++) {
      const node = nodes[i];
      const rect = node.getClientRects()[0];
      let top = rect.top + msc.scrollTop - mscTop;
      if (top < min) {
        continue;
      } else if (top > max) {
        break;
      }
      if (isNodeMember(node)) {
        visibleNodes.push({
          node: node,
          member: getUserName(node),
        });
      } else if (isNodeMemberGroup(node)) {
        visibleNodes.push({
          node: node,
          group: node.innerText,
        });
      }
    }
    return visibleNodes;
  }

  function getUserName(node) {
    if (node instanceof Node) {
      const name = document.evaluate(
        ".//span[contains(@class, 'usernameOnline')]",
        node
      ).iterateNext();
      if (name) {
        return name.innerHTML.toLowerCase();
      }
    }
  }

  function logNode(node) {
    if (node) {
      return getUserName(node) || node.innerText;
    }
    return '<no node>';
  }

  function logInfo(info) {
    if (info) {
      return info.member || info.group;
    }
    return '<undefined>';
  }

  async function estimatedProgress() {
    const estimatedUsers = await getEstimatedUsers();
    return ({
      estimatedTime: messageDelay * estimatedUsers,
      estimatedUsers,
    });
  }

  let _bail_completely_ = false;
  function stop() {
    _bail_completely_ = true;
  }

  if (document.readyState == 'complete') {
    run();
  } else {
    window.addEventListener('load', () => run());
  }
}
