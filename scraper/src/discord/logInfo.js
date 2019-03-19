export default function logInfo(info) {
  if (info) {
    return info.member || info.group;
  }
  return "<undefined>";
}
