import { createReducer } from 'redux-starter-kit';

import setJobFormAction from '../actions/setJobForm';
import setChannelMemberGroups from '../actions/setChannelMemberGroups';
import toggleIncludedGroup from '../actions/toggleIncludedGroup';
import submitJob from '../actions/submitJob';

const jobReducer = createReducer({}, {
  [setJobFormAction.type]: (state, action) => {
    Object.keys(action.payload).forEach(key => {
      state[key] = action.payload[key];
    });
  },
  [setChannelMemberGroups.type]: (state, action) => {
    state.channelGroups[action.payload.path] = action.payload.groups;
    state.includedGroups = action.payload.groups.filter(group => group === "ONLINE");
  },
  [toggleIncludedGroup.type]: (state, action) => {
    const group = action.payload.group;
    const groupIndex = state.includedGroups.indexOf(group);
    if (groupIndex !== -1) {
      state.includedGroups.splice(groupIndex, 1);
    } else {
      state.includedGroups.push(group);
    }
  },
  [submitJob.type]: (state, action) => {
    state.submitting = true;
  },
  [submitJob.responseType]: (state, action) => {
    state.confirming = false;
    state.submitting = false;
  },
});

export default jobReducer;
