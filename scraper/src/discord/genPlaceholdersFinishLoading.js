import getAvatarPlaceholder from './getAvatarPlaceholder'
import getMemberGroupPlaceholder from './getMemberGroupPlaceholder'
import getMemberScrollContainer from './getMemberScrollContainer'
import genNextFrame from './genNextFrame'

export default async function genPlaceholdersFinishLoading() {
  await nextFrame(60)
  let ap = getAvatarPlaceholder()
  let ms = getMemberScrollContainer()
  let gp = getMemberGroupPlaceholder()
  let start = performance.now()
  while (ap || !ms || gp) {
    console.log('placeholders')
    if (performance.now() - start > 30000) {
      console.log('waited 30s for placeholders')
      throw new Error('Failed to load channel')
    }
    if (ms) {
      ms.scrollTop += 1
    }
    await nextFrame(1000)
    ap = getAvatarPlaceholder()
    ms = getMemberScrollContainer()
    gp = getMemberGroupPlaceholder()
  }
}
