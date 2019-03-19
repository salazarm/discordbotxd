import genChannelInfo from './genChannelInfo';
import genChannels from './genChannels';
import genMessageChannelUsers from './genMessageChannelUsers';

let info = {};
const Driver = {
  setInfo(info) {
    info = info;
  },
  getInfo() {
    return info;
  },
  genChannelInfo: genChannelInfo,
  genChannels: genChannels,
  genMessageChannelUsers: genMessageChannelUsers,
};

window.lemmeinyouwilllose = Driver;

export default Driver;
