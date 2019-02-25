import setChannelMemberGroups from './setChannelMemberGroups';

const TYPE = "GET_EXCLUDED_GROUPS";

const getChannelMemberGroups = function(path, store) {
  //HACK Hardcode
  const path2 = path;
  const bot = encodeURIComponent('salazarm93@gmail.com');
  const channel = encodeURIComponent(path);
  fetch('/dashboard/'+bot+'/channel/'+channel)
    .then(res => res.json())
    .then((data) => {
      store.dispatch(setChannelMemberGroups({
        path: path2,
        groups: data.memberGroups,
      }));
    });
}

getChannelMemberGroups.type = TYPE;
export default getChannelMemberGroups;
