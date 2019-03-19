import genCurrentChannelInfo from "./genCurrentChannelInfo";

export default async function genEstimatedUsers() {
  const channelInfo = await genCurrentChannelInfo();
  const memberGroups = channelInfo.memberGroups;
  return memberGroups.reduce((acc, group) => {
      if (excludedGroups.indexOf(group.name) === -1) {
        acc += group.userCount;
      }
      return acc;
    },
    0
  );
}
