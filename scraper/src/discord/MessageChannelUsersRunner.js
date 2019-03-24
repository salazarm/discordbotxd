import {genRequestAssist} from './Assist';

import genEstimatedUsers from './genEstimatedUsers';
import genLoadChannel from './genLoadChannel';
import genMessageUser from './genMessageUser';
import genNextElement from './genNextElement';
import genPlaceholdersFinishLoading from './genPlaceholdersFinishLoading';
import getMemberScrollContainer from './getMemberScrollContainer';
import getUserName from './getUserName';
import isNodeMember from './isNodeMember';
import isNodeMemberGroup from './isNodeMemberGroup';
import { logMessage } from './logger';


let _runStart;
let _realStart;

let _config = {};
let processedUsers = {}

let _bail_completely_ = false;
async function run(nodeRes) {
  _bail_completely_ = false;
  _runStart = performance.now();
  const seenMembers = {};
  logMessage('loading channel');
  let currentGroup = "";
  await genLoadChannel(_config.pathname);
  getMemberScrollContainer().scrollTop = 0;
  await genPlaceholdersFinishLoading();
  logMessage('real start');
  const users = await genEstimatedUsers(_config.includedGroups);
  nodeRes(users);
  _realStart = performance.now();
  for (const group of _config.includedGroups) {
    const processed = [];
    processedUsers[group] = processed;
    while (true) {
      logMessage('iteration');

      if (_bail_completely_) {
        return;
      }
      let { next, end } = await genNextElement(processed, group);
      if (_bail_completely_) {
        return;
      }
      if (!next) {
        logMessage("no next");
        return;
      }
      if (end) {
        break;
      }

      if (isNodeMemberGroup(next)) {
        currentGroup = next.innerText.split('—')[0];
        if (group === currentGroup) {
          console.log('same group');
          continue;
        } else {
          console.log('wrong group', group, currentGroup);
          break;
        }
      } else if (isNodeMember(next)) {
        processed.push({
          member: getUserName(next)
        });
        await genMessageUser(next);
        await genLoadChannel(_config.pathname);
      }
    }
  }
  logMessage("finished processing" + processed.length);
}

let started = false;
export async function start(config, nodeRes) {
  console.log('starting messageUsersChannelFn');
  if (started) {
    console.warn('Already started MessageChannelUsers');
    return;
  }
  started = true;
  _config = config
  try {
    await run(nodeRes);
  } catch (e) {
    logMessage('bailed');
    console.error(e);
    await genRequestAssist({
      type: 'screenshot',
      name: 'Error'
    });
  }
}

export async function resume() {
  run();
}

export async function stop() {
  _bail_completely_ = true;
}
