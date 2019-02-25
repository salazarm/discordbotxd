import { createReducer } from 'redux-starter-kit';

import setJobFormAction from '../actions/setJobForm';
import setChannelMemberGroups from '../actions/setChannelMemberGroups';
import toggleExcludedGroup from '../actions/toggleExcludedGroup';
import submitJob from '../actions/submitJob';

const jobReducer = createReducer({}, {
  [setJobFormAction.type]: (state, action) => {
    Object.keys(action.payload).forEach(key => {
      state[key] = action.payload[key];
    });
  },
  [setChannelMemberGroups.type]: (state, action) => {
    state.channelGroups[action.payload.path] = action.payload.groups;
    state.excludedGroups = action.payload.groups;
  },
  [toggleExcludedGroup.type]: (state, action) => {
    const group = action.payload.group;
    const groupIndex = state.excludedGroups.indexOf(group);
    if (groupIndex !== -1) {
      state.excludedGroups.splice(groupIndex, 1);
    } else {
      state.excludedGroups.push(group);
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
