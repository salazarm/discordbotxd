export default async function messageUser(userDiv) {
  let contextMenu;
  let _start = performance.now();
  do {
    const e = userDiv.ownerDocument.createEvent("MouseEvents");
    e.initMouseEvent(
      "contextmenu",
      true,
      true,
      userDiv.ownerDocument.defaultView,
      1,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      2,
      null
    );
    userDiv.dispatchEvent(e);
    await nextFrame(300);
    if (_start - performance.now() > 12000) {
      console.log("stuck waiting on ctx");
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
    await nextFrame(60);
  }

  while (performance.now() - lastMessageTS < messageDelay - 2500) {
    await nextFrame(60);
  }
  await nextFrame(Math.random() * 5000);
  lastMessageTS = performance.now();
  input.value = message;
  console.log("requesting assist for" + getUserName(userDiv));
  // await get"requesting assist for"essage', input: input});
  // await confirmMessageSent();
}
