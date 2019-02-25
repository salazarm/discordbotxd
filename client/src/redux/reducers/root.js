import { combineReducers } from 'redux'

import dashboardResponseReducer from './dashboard';
import userReducer from './user';
import jobReducer from './jobform';
import botpaneReducer from './botpane';

export default combineReducers({
  dashboard: dashboardResponseReducer,
  user: userReducer,
  jobForm: jobReducer,
  botpane: botpaneReducer,
});
