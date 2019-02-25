import { createReducer } from 'redux-starter-kit';

import signin from '../actions/signin';
import successfulLogin from '../actions/successfulLogin';
import signout from '../actions/signout';

const userReducer = createReducer({}, {
  [signin.type]: (state, action) => {
    state.status = 'PENDING'
  },
  [successfulLogin.type]: (state, action) => {
    state.status = 'ONLINE';
  },
  [signout.type]: (state, action) => {
    state.status = 'OFFLINE'
  }
});

export default userReducer;
