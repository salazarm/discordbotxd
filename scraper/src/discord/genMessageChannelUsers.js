let runStart;
let realStart;
const processed = [];

async function run() {
  _bail_completely_ = false;
  runStart = performance.now();
  const seenMembers = {};
  let currentGroup = "";
  await loadChannel(pathname);
  getMemberScrollContainer().scrollTop = 0;
  await placeholdersFinishLoading();
  realStart = performance.now();

  let responsedWithEstimatedTime = false;
  while (true) {
    if (processed.filter(f => f.member).length === 10) {
      res({
        timePerMessage: Math.ceil((performance.now() - realStart) / 1000)
      });
    }

    if (_bail_completely_) {
      return;
    }
    let { next, end } = await getNext(processed, currentGroup);
    if (_bail_completely_) {
      return;
    }
    if (!next) {
      console.log("no next");
      return;
    }
    if (end) {
      break;
    }

    if (isNodeMemberGroup(next)) {
      currentGroup = next.innerText.split("—")[0];
      if (currentGroup === "OFFLINE") {
        console.log("complete");
        break;
      }
      console.log("now " + currentGroup);
      processed.push({
        group: currentGroup
      });
    } else if (isNodeMember(next)) {
      if (excludedGroups.indexOf(currentGroup) === -1) {
        await messageUser(next);
        await loadChannel(pathname);
      } else {
      }
      processed.push({
        member: getUserName(next)
      });
    }
  }
  console.log("finished processing" + processed.length);
}

export default async function genMessageChannelUsers(path, config) {}
