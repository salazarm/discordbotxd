module.exports = function injectedDriverExtension(token, email, password, selRes) {
  const [token, email, password, selRes] = arguments;
  let secret = 'a'+Math.random();
  const Driver = window.InjectedDriverExtension = {
    token,
    password,
    email,
    channels: [],
  };

  Driver.getChannelInfo = async function(channel) {
    try {
      await loadChannel(channel);
    } catch (e) {
      return {
        memberGroups: ['Server error, please try again'],
      };
    }
    return await getCurrentChannelInfo();
  };

  async function start() {
    await new Promise(async (res, rej) => {
      const id = setInterval(async () => {
        const channel = document.evaluate(
          "//a[contains(@href,'/channels/') and not(contains(@href, '@me'))]",
          document
        ).iterateNext();
        if (channel) {
          console.log('found channel', channel);
          clearInterval(id);
          await nextFrame(1000);
          return res();
        }
        console.log('waiting');
      }, 1000);
    });
    selRes(Driver.getChannels());
  }

  Driver.getChannels = function() {
    const channelLinks = document.evaluate(
      "//a[contains(@href,'/channels/') and not(contains(@href, '@me'))]",
      document
    );
    let link;
    while(link = channelLinks.iterateNext()) {
      // memory leak?
      Driver.channels.push({
        pathname: link.pathname.replace(/(\/[^\/]+\/[^\/]+).*$/, '$1'),
        name: link.getAttribute('aria-label'),
        icon: link.childNodes[0].style.backgroundImage,
      });
    }
    return Driver.channels;
  }

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
          console.log('lastGroup,'+JSON.stringify(lastGroup));
          memberGroups.push(lastGroup);
          if (groupName.includes('ONLINE')) {
            console.log('exiting cuz found online');
            exit = true;
            break;
          }
        }
      }

      if (exit) {
        break;
      }

      if (lastGroup) {
        console.log('Adding last group scrollTop '+JSON.stringify(lastGroup));
        scrollTop += (lastGroup.userCount * 42 * 0.97 - height);
        lastGroup = null;
      } else {
        console.log('Adding height');
        scrollTop += (height * 0.75);
      }
      scrollTop = Math.min(scrollTop, contentHeight - height);
      getMemberScrollContainer().scrollTop = scrollTop;
      console.log('scrolltop' + scrollTop);
      await placeholdersFinishLoading();
    } while (scrollTop < contentHeight - height);
    getMemberScrollContainer().scrollTop = 0;
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
    await nextFrame(60);
    let ap = getAvatarPlaceholder();
    let ms = getMemberScrollContainer();
    let gp = getMemberGroupPlaceholder();
    let start = performance.now()
    while((ap || !ms || gp)) {
      console.log('placeholders');
      if (performance.now() - start > 30000) {
        console.log('waited 30s for placeholders');
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

  if (document.readyState == 'complete') {
    start();
  } else {
    window.addEventListener('load', () => Driver.start());
  }
}
