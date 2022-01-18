import { logMessage } from './logger';

export async function genRequestAssist(options) {
  if (window.clientQueueAction) {
    const assist = await window.clientQueueAction(options);
    return assist;
  }
  return await new Promise(res => {
    window.clientQueueAction = async function(fn) {
      delete window.clientQueueAction;
      const result = await fn(options);
      res(result);
    };
  });
}

export async function genServerReceiveAssist(receiveCommand) {
  if (window.d13cfsua) {
    window.d13cfsua(assist)
  }
  window.clientQueueAction = function(options) {
    delete window.clientQueueAction;
    assist(options);
  }

   async function assist(options) {
    const promise = new Promise((res) => {
      window.serverResponse = function(info) {
        delete window.serverResponse;
        res(info);
      }
    });

    receiveCommand(options);
    return await promise;
  }
}

export async function genServerAssistResponse(info, res) {
  if (window.d14cfsua) {
    window.serverResponse(info);
    res({success: true});
  } else {
    res({success: false});
  }
}
