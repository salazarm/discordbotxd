import genCurrentChannelInfo from "./genCurrentChannelInfo";

export default async function genEstimatedUsers(includedGroups) {
  const channelInfo = await genCurrentChannelInfo();
  const memberGroups = channelInfo.memberGroups;
  return memberGroups.reduce((acc, group) => {
      if (includedGroups.indexOf(group.name) !== -1) {
        acc += group.userCount;
      }
      return acc;
    },
    0
  );
}
