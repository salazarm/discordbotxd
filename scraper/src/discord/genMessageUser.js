import {genRequestAssist} from './Assist';

import genNextFrame from './genNextFrame';
import getUserName from './getUserName';
import { logMessage } from "./logger";
import triggerRightClickEvent from './triggerRightClickEvent';

let lastMessageTS = 0;

const MESSAGE_DELAY = 30000;

export default async function messageUser(userDiv) {
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
    logMessage("Error pressing messageButton");
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

  while (performance.now() - lastMessageTS < MESSAGE_DELAY - 2500) {
    logMessage("waiting before messaging");
    await genNextFrame(60);
  }
  await genNextFrame(Math.random() * 5000);
  lastMessageTS = performance.now();
  input.value = 'test';
  logMessage("requesting assist for" + getUserName(userDiv));
  await genRequestAssist({type: 'submit_message', input: input});
  // await confirmMessageSent();
}
