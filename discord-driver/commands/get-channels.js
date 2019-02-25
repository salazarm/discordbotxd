module.exports = function injectedDriverExtensionGetChannel(channel, res) {
  const Driver =  window.InjectedDriverExtension;
  (async function() {
    const data = Driver.getChannels();
    res(data);
    console.log('resolved' + JSON.stringify(data));
  })();
}
