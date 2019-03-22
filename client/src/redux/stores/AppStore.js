import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'

// We'll use redux-logger just as an example of adding another middleware
import logger from 'redux-logger'

// And use redux-batch as an example of adding enhancers
import { reduxBatch } from '@manaflair/redux-batch'

import rootReducer from '../reducers/root.js';

const middleware = [...getDefaultMiddleware(), logger]

const preloadedState = {
  dashboard: {
    bots: [],
    id: '',
    status: '',
    jobs: [],
    pane: null,
  },
  user: {
    status: 'OFFLINE'
  },
  jobForm: {
    includedGroups: [],
    messageDelay: 20,
    channelGroups: {},
    confirming: false,
    submitting: false,
    pathname: null,
    message: '',
  },
  botpane: {
    refreshing: false,
  },
};

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
  enhancers: [reduxBatch]
});

// The store has been created with these options:
// - The slice reducers were automatically passed to combineReducers()
// - redux-thunk and redux-logger were added as middleware
// - The Redux DevTools Extension is disabled for production
// - The middleware, batch, and devtools enhancers were automatically composed together

export default store;
