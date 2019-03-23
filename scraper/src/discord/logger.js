export function logMessage(...args) {
  let message = '';
  for (let i = 0, l = args.length; i < l; i++) {
    message += ' ' + args[i];
  }
  console.log(message);
}
