import Assist from './Assist';

import genChannelInfo from './genChannelInfo';
import genChannels from './genChannels';
import {start} from './MessageChannelUsersRunner';

let info = {};
const Driver = {
  Assist: Assist,
  setInfo(info) {
    info = info;
  },
  getInfo() {
    return info;
  },
  genChannelInfo: genChannelInfo,
  genChannels: genChannels,
  genMessageChannelUsers: start,
};

window.document.lemmeinyouwilllose = Driver;

export default Driver;
