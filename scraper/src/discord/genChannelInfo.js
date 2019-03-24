import genLoadChannel from './genLoadChannel';
import genCurrentChannelInfo from './genCurrentChannelInfo';

import logMessage from './logger';

export default async function(channel) {
  logMessage('genChannelInfo', channel);
  try {
    await genLoadChannel(channel);
  } catch (e) {
    return {
      memberGroups: ['Server error, please try again'],
    };
  }
  logMessage('loaded channel');
  return await genCurrentChannelInfo();
};
