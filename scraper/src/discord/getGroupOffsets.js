const GROUP_HEIGHT = 40;
const MEMBER_HEIGHT = 40;

export default function getGroupOffsets(channelGroupInfo, group) {
  const groups = channelGroupInfo.memberGroups;
  let offset = 0;
  let startOffset = 0;
  let endOffset = 0;
  for (let i = 0, l = groups.length; i < l; i++) {
    startOffset = offset;
    offset += GROUP_HEIGHT + 1;
    offset += (MEMBER_HEIGHT + 1) * groups[i].userCount;
    endOffset = offset - 1;
    if (groups[i].name === group) {
      return [startOffset, endOffset];
    }
  }
  return [startOffset, endOffset];
}
