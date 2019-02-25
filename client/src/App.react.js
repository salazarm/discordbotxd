import React, { Component } from 'react';
import './App.css';
import getCookie from './lib/getCookie';

import dashboardResponse from './redux/actions/dashboardResponse.js';
import signinAction from './redux/actions/signin.js';

import AppStore from './redux/stores/AppStore.js'
import Dashboard from './components/Dashboard.react.js';
import SigninForm from './components/SigninForm.react.js';
import LoadingSpinner from './components/LoadingSpinner.react.js';

class App extends Component {
  constructor() {
    super();
    const session = getCookie('session');
    this.state = {
      loggingIn: session ? 1 : 0,
    };
    if (session) {
      fetch('/dashboard')
        .then(res => res.json())
        .then(dashboard => {
          AppStore.dispatch(dashboardResponse(dashboard));
        })
        .catch(() => {
          alert('error');
        });
    }
  }

  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      let pane;
      if (state.user.status === 'PENDING') {
        pane = 'LOADING';
      } else if (state.user.status === 'ONLINE') {
        pane = 'DASHBOARD';
      }
      this.setState({pane});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  login = (email, password) => {
    signinAction(email, password, AppStore);
  }

  render() {
    let body;
    if (this.state.pane === 'LOADING') {
      body = (
        <div className="loader"></div>
      );
    } else if (this.state.pane === 'DASHBOARD') {
      body = <Dashboard/>;
    } else {
      body = <SigninForm login={this.login}/>;
    }
    return (
      <div className="App">
        {body}
      </div>
    );
  }
}

export default App;
