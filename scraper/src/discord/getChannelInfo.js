export default async function getChannelInfo(channel) {
  try {
    await loadChannel(channel)
  } catch (e) {
    return {
      memberGroups: ['Server error, please try again'],
    }
  }
  return await getCurrentChannelInfo()
}
