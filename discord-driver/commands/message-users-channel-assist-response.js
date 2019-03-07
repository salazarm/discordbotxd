module.exports = async function op(info, res) {
  console.log('responding'+JSON.stringify(info));
  if (window.d14cfsua) {
    window.d14cfsua(info);
    delete window.d14cfsua;
    res({success: true});
  } else {
    res({success: false});
  }
}
