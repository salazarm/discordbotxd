export default async function genAssist(options) {
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
