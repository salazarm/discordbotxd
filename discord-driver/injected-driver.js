module.exports = function injectedDriverExtension(token, email, password, selRes) {
  let secret = 'a'+Math.random();
  const Driver = window.InjectedDriverExtension = {
    token,
    password,
    email,
    channels: [],
  };

  Driver.start = function() {
    (async function() {
      await new Promise(async (res, rej) => {
        const id = setInterval(async () => {
          const channel = document.evaluate(
            "//a[contains(@href,'/channels/') and not(contains(@href, '@me'))]",
            document
          ).iterateNext();
          if (channel) {
            clearInterval(id);
            await Driver.nextFrame(1000);
            return res();
          }
          console.log('waiting');
        }, 1000);
      });
      selRes(Driver.getChannels());
    })();
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

  Driver.loadChannel = async function(channel) {
    getChannelLink(channel).click();
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
      getChannelLink(channel).click();
      await Driver.nextFrame(1000);
      ap = getAvatarPlaceholder();
      ms = getMemberScrollContainer();
      gp = getMemberGroupPlaceholder();
    }
  }

  Driver.getChannelInfo = async function(channel) {
    try {
      await Driver.loadChannel(channel);
    } catch (e) {
      return {
        memberGroups: ['Server error, please try again'],
      };
    }
    return await Driver.getCurrentChannelInfo();
  };

  Driver.getCurrentChannelInfo = async function() {
    const memberGroups = [];
    const memberScrollContainer = getMemberScrollContainer();
    memberScrollContainer.scrollTop = 0;
    memberScrollContainer.scrollTop = 10;
    await Driver.nextFrame();
    memberScrollContainer.scrollTop = 0;
    await Driver.nextFrame();
    let scrollTop = 0;
    const height = memberScrollContainer.offsetHeight;
    const contentHeight = memberScrollContainer.scrollHeight;
    do {
      console.log('REMAINING: ' + (contentHeight - scrollTop - height));
      // get member groups
      const memberGroupSpans = document.evaluate(
        "//div[contains(@class,'membersGroup')]",
        document,
      );
      let group;
      let exit = false;
      while(group = memberGroupSpans.iterateNext()) {
        const name = group.innerText;
        if (name.includes('ONLINE') || name.includes('OFFLINE')) {
          exit = true;
        } else if (memberGroups.indexOf(name) === -1){
          memberGroups.push(name.split('—')[0]);
        }
      }

      if (exit) {
        break;
      }

      scrollTop += height / 2;
      scrollTop = Math.min(scrollTop, contentHeight - height);
      memberScrollContainer.scrollTop = scrollTop;
      await Driver.nextFrame();
      let add = 10;
      window.started = window.started || performance.now();
      while(getAvatarPlaceholder()) {
        memberScrollContainer.scrollTop += add;
        add *= -1;
        if (performance.now % 3 === 0) {
          console.log('placeholder'+ add);
        }
        await Driver.nextFrame();
        if (performance.now() - window.started > 30000) {
          return {
            memberGroups: memberGroups,
          };
        }
      }
      memberScrollContainer.scrollTop = scrollTop;
      await Driver.nextFrame();
    } while (scrollTop < contentHeight - height);
    memberScrollContainer.scrollTop = 0;
    return {
      memberGroups: memberGroups,
    };
  }

  Driver.nextFrame = async function(timer) {
    return await new Promise((res, rej) => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          res();
        }, timer ? timer : 30)
      })
    });
  }

  if (document.readyState == 'complete') {
    Driver.start();
  } else {
    window.addEventListener('load', () => Driver.start());
  }
}
