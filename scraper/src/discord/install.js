import {
  genServerReceiveAssist,
  genServerAssistResponse,
} from './Assist';

import genBinarySearchFind from './genBinarySearchFind';
import genChannelInfo from './genChannelInfo';
import genChannels from './genChannels';
import {start, stop, resume} from './MessageChannelUsersRunner';

let info = {};
const Driver = {
  Assist: {
    genServerReceiveAssist,
    genServerAssistResponse,
  },
  genChannelInfo: genChannelInfo,
  genChannels: genChannels,
  genMessageChannelUsers: start,
  genStopMessageChannelUsers: stop,
  genResumeMessageChannelUsers: resume,
  genBinarySearchFind: genBinarySearchFind,
  genServerReceiveAssist: genServerReceiveAssist,
};

window.document.lemmeinyouwilllose = Driver;

export default Driver;
