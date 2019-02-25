import { createAction } from 'redux-starter-kit';

import dashboardRefresh from './dashboardRefresh';

const TYPE = "REFRESH_BOT_PANE_START";
const RESPONSE_TYPE = "REFRESH_BOT_PANE_END";

const refreshBotAction = function(email, store) {
  store.dispatch({type: TYPE});
  fetch('/dashboard/'+encodeURIComponent(email))
    .then(res => res.json())
    .then((data) => {
      store.dispatch({type: RESPONSE_TYPE});
      store.dispatch(dashboardRefresh({
        email: email,
        channels: data,
      }));
    });
}

refreshBotAction.type = TYPE;
refreshBotAction.responseType = RESPONSE_TYPE;
export default refreshBotAction;
