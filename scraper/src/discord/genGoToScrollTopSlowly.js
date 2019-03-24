import getMemberScrollContainer from './getMemberScrollContainer';
import genNextFrame from './genNextFrame';
import genPlaceholdersFinishLoading from './genPlaceholdersFinishLoading';

export default async function genGoToScrollTopSlowly(scrollTop) {
  const current = getMemberScrollContainer().scrollTop;
  const diff = scrollTop - current;
  await genNextFrame(100);
  let i = 0;
  while (i++ < 5) {
    const now = current + diff * i / 5;
    getMemberScrollContainer().scrollTop = now;
    console.log('setting now', now);
    await genPlaceholdersFinishLoading();
  }
}
