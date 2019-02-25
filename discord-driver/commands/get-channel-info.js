module.exports = function injectedDriverExtensionGetChannel(channel, res) {
  const Driver =  window.InjectedDriverExtension;
  (async function() {
    const data = await Driver.getChannelInfo(channel);
    res(data);
    console.log('resolved' + JSON.stringify(data));
  })();
}
