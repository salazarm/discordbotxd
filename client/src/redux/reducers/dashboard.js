import { createReducer } from 'redux-starter-kit';

import dashboardRefresh from '../actions/dashboardRefresh';
import dashboardResponse from '../actions/dashboardResponse';
import startCreateJob from '../actions/startCreateJob';
import setDashboardPane from '../actions/setDashboardPane';
import submitJob from '../actions/submitJob';

const dashboardReducer = createReducer({}, {
  [dashboardResponse.type]: (state, action) => {
    Object.keys(action.payload).forEach((key) =>{
      state[key] = action.payload[key];
    });
    let pane = 'JOBS';
    let id = null;
    if (state.jobs.length === 0) {
      if (state.bots.length) {
        pane = "BOT";
        id = state.bots[0].email;
      } else {
        pane = "CREATE_BOT";
      }
    }
    state.pane = pane;
    state.id = id;
  },
  [startCreateJob.type]: (state, action) => {
    state.pane = 'CREATE_JOB';
    state.createJob = action.payload;
  },
  [setDashboardPane.type]: (state, action) => {
    state.pane = action.payload.pane;
    state.id = action.payload.id;
  },
  [dashboardRefresh.type]: (state, action) => {
    const {email, channels} = action.payload;
    const bot = state.bots.find(bot => bot.email === email);
    bot.channels = channels;
  },
  [submitJob.responseType]: (state, action) => {
    state.pane = "JOB";
    state.id = action.payload.id;
  },
});

export default dashboardReducer;
