const GROUP_HEIGHT = 40;
const MEMBER_HEIGHT = 42;

export default function getGroupOffsets(channelGroupInfo, group) {
  const groups = channelGroupInfo.memberGroups;
  let offset = 0;
  let startOffset = 0;
  let endOffset = 0;
  for (let i = 0, l = groups.length; i < l; i++) {
    offset += GROUP_HEIGHT;
    startOffset = offset;
    offset += MEMBER_HEIGHT * groups[i].userCount;
    endOffset = offset;
    if (groups[i].name === group) {
      return [startOffset, endOffset];
    }
  }
  return [startOffset, endOffset];
}
