import Assist from './Assist';

import genNextElement from './genNextElement';
import genLoadChannel from './genLoadChannel';
import genMessageUser from './genMessageUser';
import genPlaceholdersFinishLoading from './genPlaceholdersFinishLoading';
import getMemberScrollContainer from './getMemberScrollContainer';
import getUserName from './getUserName';
import isNodeMember from './isNodeMember';
import isNodeMemberGroup from './isNodeMemberGroup';


let _runStart;
let _realStart;

let _config = {};
const processed = [];

let _bail_completely_ = false;
async function run(nodeRes) {
  _bail_completely_ = false;
  _runStart = performance.now();
  const seenMembers = {};
  console.log('loading channel');
  let currentGroup = "";
  await genLoadChannel(_config.pathname);
  getMemberScrollContainer().scrollTop = 0;
  await genPlaceholdersFinishLoading();
  console.log('real start');
  _realStart = performance.now();

  let respondedWithEstimatedTime = false;
  for (const group of _config.includedGroups) {
    const processed = [];
    while (true) {
      console.log('iteration');
      if (processed.filter(f => f.member).length === 10 && !respondedWithEstimatedTime) {
        respondedWithEstimatedTime = true;
        nodeRes({
          timePerMessage: Math.ceil((performance.now() - _realStart) / 1000)
        });
      }

      if (_bail_completely_) {
        return;
      }

      let { next, end } = await genNextElement(processed, group);
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
        console.log('finished: ' + group);
        break;
      } else if (isNodeMember(next)) {
        processed.push({
          member: getUserName(next)
        });
        await genMessageUser(next, _config.messageDelay);
        await genLoadChannel(_config.pathname);
      }
    }
  }
  console.log("finished processing" + processed.length);
}

let started = false;
export async function start(config, nodeRes) {
  if (started) {
    console.warn('Already started MessageChannelUsers');
    return;
  }
  started = true;
  _config = config
  try {
    await run(nodeRes);
  } catch (e) {
    console.log('bailed');
    console.error(e);
    await Assist.genRequestAssist({
      type: 'screenshot',
      name: 'Error'
    });
  }
}

export async function pause() {
  _bail_completely_ = true;
}

export async function resume() {
  run();
}

export async function stop() {
  _bail_completely_ = true;
}
