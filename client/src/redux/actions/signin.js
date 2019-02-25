import dashboardResponse from './dashboardResponse';
import successfulLogin from './successfulLogin';

const TYPE = "SIGNING_IN";

const signinAction = function(email, password, store) {
  store.dispatch({type: TYPE});
  fetch('/signin', {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers:{
      'Content-Type': 'application/json'
    },
  }).then(res => res.json())
  .then((data) => {
    store.dispatch(successfulLogin());
    store.dispatch(dashboardResponse(data));
    // Setup WebSocket connection here.
  });
}

signinAction.type = TYPE;
export default signinAction;
