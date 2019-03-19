import genEstimatedUsers from "./genEstimatedUsers";

export default async function genEstimatedProgress() {
  const estimatedUsers = await genEstimatedUsers();
  return {
    estimatedTime: messageDelay * estimatedUsers,
    estimatedUsers
  };
}
