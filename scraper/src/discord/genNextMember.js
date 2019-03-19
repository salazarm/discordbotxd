export default async function genNextMember(processed, currentGroup) {
  if (!processed.length) {
    // First iteration... use the first div...
    // Skip the div added for lazy scrolling go to index 1.
    const next = getMemberScrollContainer().children[1];
    console.log("first," + next.innerHTML);
    return { next: next };
  }
  const prev = processed[processed.length - 1];
  console.log("on prev" + logInfo(prev));

  const name = typeof prev.member === "string" ? prev.member : "";
  const channelInfo = await getCurrentChannelInfo("ONLINE");
  const [startOffset, endOffset] = getGroupOffsets(channelInfo, currentGroup);
  const next = await findNext(name, startOffset, endOffset);

  if (next) {
    return { next: next };
  }
  return { exit: true };
}
