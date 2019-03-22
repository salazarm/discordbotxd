export default (div) => {
  const e = div.ownerDocument.createEvent("MouseEvents");
  e.initMouseEvent(
    "contextmenu",
    true,
    true,
    div.ownerDocument.defaultView,
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
  div.dispatchEvent(e);
};
