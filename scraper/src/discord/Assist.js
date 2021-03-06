import { logMessage } from './logger';

export async function genRequestAssist(options) {
  if (window.d13cfsua) {
    const assist = await window.d13cfsua(options);
    return assist;
  }
  return await new Promise(res => {
    window.d13cfsua = async function(fn) {
      delete window.d13cfsua;
      const result = await fn(options);
      res(result);
    };
  });
}

export async function genServerReceiveAssist(receiveCommand) {
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
        delete window.d14cfsua;
        res(info);
      }
    });

    receiveCommand(options);
    return await promise;
  }
}

export async function genServerAssistResponse(info, res) {
  if (window.d14cfsua) {
    window.d14cfsua(info);
    delete window.d14cfsua;
    res({success: true});
  } else {
    res({success: false});
  }
}
