import genLoadChannel from './genLoadChannel';
import genCurrentChannelInfo from './genCurrentChannelInfo';

export default async function(channel) {
  try {
    await genLoadChannel(channel);
  } catch (e) {
    return {
      memberGroups: ['Server error, please try again'],
    };
  }
  return await genCurrentChannelInfo();
};
