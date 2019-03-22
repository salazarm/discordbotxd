import {genRequestAssist} from './Assist';

import genNextFrame from './genNextFrame';
import getUserName from './getUserName';
import triggerRightClickEvent from './triggerRightClickEvent';

let lastMessageTS = 0;

export default async function messageUser(userDiv, messageDelay) {
  let contextMenu;
  let _start = performance.now();
  do {
    triggerRightClickEvent(userDiv);
    await genNextFrame(300);
    if (_start - performance.now() > 12000) {
      throw new Error("stuck waiting on ctx");
    }
  } while (
    !(contextMenu = document
      .evaluate("//div[contains(@class, 'contextMenu')]", document)
      .iterateNext())
  );
  const messageButton = document
    .evaluate(".//span[contains(., 'Message')]", contextMenu)
    .iterateNext();

  try {
    new Promise(res => {
      res();
      messageButton.click();
    });
  } catch (e) {
    console.log("Error pressing messageButton");
    return;
  }

  let input;
  while (
    !(input = document
      .evaluate("//textarea[contains(@placeholder, 'Message')]", document)
      .iterateNext())
  ) {
    await genNextFrame(60);
  }

  while (performance.now() - lastMessageTS < messageDelay - 2500) {
    await genNextFrame(60);
  }
  await genNextFrame(Math.random() * 5000);
  lastMessageTS = performance.now();
  input.value = message;
  console.log("requesting assist for" + getUserName(userDiv));
  await genRequestAssist({type: 'submit_message', input: input});
  // await confirmMessageSent();
}
