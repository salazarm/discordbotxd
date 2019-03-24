import getMemberScrollContainer from "./getMemberScrollContainer";
import genNextFrame from "./genNextFrame";
import genPlaceholdersFinishLoading from "./genPlaceholdersFinishLoading";

export default async function genCurrentChannelInfo(end) {
  console.log('in genCurrentChannelInfo');
  const seen = {};
  const memberGroups = [];
  const memberScrollContainer = getMemberScrollContainer();
  memberScrollContainer.scrollTop = 0;
  memberScrollContainer.scrollTop = 10;
  await genNextFrame();
  memberScrollContainer.scrollTop = 0;
  await genNextFrame();
  let scrollTop = 0;
  const height = memberScrollContainer.offsetHeight;
  const contentHeight = memberScrollContainer.scrollHeight;
  let lastGroup = null;
  do {
    // get member groups
    const memberGroupSpans = document.evaluate(
      "//div[contains(@class,'membersGroup')]",
      document
    );
    let group;
    let exit = false;
    while ((group = memberGroupSpans.iterateNext())) {
      let name = group.innerText;
      if (!seen[name]) {
        seen[name] = true;
        const [groupName, userCount] = name.split("—");
        lastGroup = {
          name: groupName,
          userCount: parseInt(userCount)
        };
        memberGroups.push(lastGroup);
        if (groupName.includes("ONLINE")) {
          exit = true;
          break;
        }
      }
    }

    if (exit) {
      break;
    }

    if (lastGroup) {
      scrollTop += lastGroup.userCount * 42 * 0.98 - height / 2;
      lastGroup = null;
    } else {
      scrollTop += height * 0.75;
    }
    scrollTop = Math.min(scrollTop, contentHeight - height);
    getMemberScrollContainer().scrollTop = scrollTop;
    await genPlaceholdersFinishLoading();
  } while (scrollTop < contentHeight - height);
  getMemberScrollContainer().scrollTop = 0;
  await genPlaceholdersFinishLoading();
  return {
    memberGroups: memberGroups
  };
}
