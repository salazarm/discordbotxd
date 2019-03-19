import genChannelInfo from './genChannelInfo';
import genChannels from './genChannels';
import genMessageChannelUsers from './genMessageChannelUsers';
import genNextFrame from './genNextFrame';

export default async function injectedDriverExtensionInstall() {
  let info = {}
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
  }
  window.document.lemmeinyouwilllose = Driver
}
