import { createReducer } from 'redux-starter-kit';

import refreshBotPane from '../actions/refreshBotPane';

const botReducer = createReducer({}, {
  [refreshBotPane.type]: (state, action) => {
    state.refreshing = true;
  },
  [refreshBotPane.responseType]: (state, action) => {
    state.refreshing = false;
  },
});

export default botReducer;
