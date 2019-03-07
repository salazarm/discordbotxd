module.exports = async function op(params, res) {
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

  async function getCurrentChannelInfo() {
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
        if (name.includes('OFFLINE')) {
          console.log("FOUND OFFLINE");
          name = "OFFLINE";
        }
        if (!seen[name]){
          const rect = group.getClientRects()[0];
          console.log('rect,'+JSON.stringify(rect));
          memberGroups.push({
            name: name.split('—')[0],
            offset: getMemberScrollContainer().scrollTop + rect.top,
          });
          if (name.includes('OFFLINE')) {
            exit = true;
            break;
          }
        }
      }

      if (exit) {
        break;
      }

      scrollTop += height / 2;
      scrollTop = Math.min(scrollTop, contentHeight - height);
      memberScrollContainer.scrollTop = scrollTop;
      await nextFrame();
      let add = 10;
      window.started = window.started || performance.now();
      while(getAvatarPlaceholder()) {
        memberScrollContainer.scrollTop += add;
        add *= -1;
        await nextFrame();
        if (performance.now() - window.started > 30000) {
          return {
            memberGroups: memberGroups,
          };
        }
      }
      memberScrollContainer.scrollTop = scrollTop;
      await nextFrame();
    } while (scrollTop < contentHeight - height);
    memberScrollContainer.scrollTop = 0;
    await nextFrame();
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
    let ap = getAvatarPlaceholder();
    let ms = getMemberScrollContainer();
    let gp = getMemberGroupPlaceholder();
    let start = performance.now()
    while((ap || !ms || gp)) {
      console.log('placeholders');
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
    console.log('scrolling');
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

  async function getEstimatedUsers(height) {
    const channelInfo = await getCurrentChannelInfo();
    const memberGroups = channelInfo.memberGroups;
    const end = memberGroups.find(g => g.name === 'OFFLINE');
    let start;
    for (let i = 0, l = memberGroups.length; i < l; i++) {
      if (excludedGroups.indexOf(memberGroups[i].name) === -1) {
        start = memberGroups[i];
        break;
      }
    }
    if (start && end) {
      return (end.offset - start.offset) / height;
    }
    return null;
  }

  async function messageUser(userDiv) {
    const e = element.ownerDocument.createEvent('MouseEvents');
    e.initMouseEvent(
      'contextmenu',
      true, true,
      element.ownerDocument.defaultView,
      1, 0, 0, 0, 0,
      false, false, false, false, 2, null
    );
    userDiv.dispatchEvent(e);
    await nextFrame(60);

    let contextMenu;
    while(!(
      contextMenu =
        document
          .evaluate("//div[contains(@class, 'contextMenu')]", document)
          .iterateNext()
    )) {
      console.log('waiting for contextmenu');
      await nextFrame(30);
    }
    const messageButton  =
      document
        .evaluate(".//span[contains(., 'Message')]", contextMenu)
        .iterateNext();

    messageButton.click();

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
    console.log('got input');
    input.value = message;
    console.log('requesting assist');
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

  async function getNext(processed, currentGroup) {
    if (!processed.length) {
      // First iteration... use the first div...
      // Skip the div added for lazy scrolling go to index 1.
      const next = getMemberScrollContainer().children[1];
      console.log('first,'+next.outerHTML);
      return {next: next};
    }
    const prev = processed[processed.length - 1];
    if (prev.group) {
      next = prev.nextSibling;
      if (!next || next.getAttribute('class').indexOf('member') === -1) {
        await scrollMemberListUp(2);
        await scrollMemberListDown(5);
        await scrollMemberListDown(450);
        if (
          !prev ||
          !prev.nextSibling ||
          prev.nextSibling.getAttribute('class').indexOf('member') === -1
        ) {
          return {exit: true};
        }
        next = prev.nextSibling;
      }
      return {next: next};
    }
    // If the previously processed entry is a member then our scroll position
    // was reset... find  element.
    const name = prev.member;
    const scrollTop = prev.scrollTop;
  }


  async function run() {
    const seenMembers = {};
    const processed = [];
    let currentGroup = '';

    await loadChannel(pathname);
    console.log('loaded '+pathname);

    let responsedWithEstimatedTime = false;
    while (true) {
      if (processed.length === 2 && !responsedWithEstimatedTime) {
        responsedWithEstimatedTime = true;
        const estimatedUser = await getEstimatedUsers(processed[1].offsetHeight);
        const estimatedTime = messageDelay * estimatedUsers;
        res({
          estimatedTime,
          estimatedUsers,
        });
      }

      let {next, end} = getNext(processed, currentGroup);
      if (end) {
        break;
      }

      if (isNodeMemberGroup(next)) {
        currentGroup = next.innerText.split('—')[0];
        if (currentGroup === 'OFFLINE') {
          break;
        }
        console.log('now ' + currentGroup);
        processed.push({group: currentGroup, node: next});
      } else if (isNodeMember(next)) {
        if (excludedGroups.indexOf(currentGroup) === -1) {
          console.log('found member');
          await messageUser(next);
          await loadChannel(channel);
        } else {
          console.log('excluded member');
        }
        processed.push({
          member: getUserName(name),
          node: next,
          top: next.getClientRects()[0].top + getMemberScrollContainer().scrollTop,
        });
      }
    }
    console.log('finished processing' + processed.length);
  }

  if (document.readyState == 'complete') {
    run();
  } else {
    window.addEventListener('load', () => run());
  }
}
