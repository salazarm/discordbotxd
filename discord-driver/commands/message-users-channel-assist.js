module.exports = async function receiveCommand(receiveCommand) {
  if (window.d13cfsua) {
    window.d13cfsua(assist)
  }
  window.d13cfsua = function(options) {
    delete window.d13cfsua;
    assist(options);
  }

  async function assist(options) {
    const promise = new Promise((res) => {
      window.d14cfsua = function(info) {
        console.log('receiving assist from lebron');
        delete window.d14cfsua;
        res(info);
      }
    });

    receiveCommand(options);
    return await promise;
  }
}
