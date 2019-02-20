import React, { Component } from 'react';
import './App.css';
import getCookie from './lib/getCookie';

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
        .then(dashboard => this.setState({
          loggingIn: false,
          dashboard: dashboard,
        }))
        .catch(() => {
          document.location.path = ''
        });
    }
  }

  render() {
    let body;
    if (this.state.loggingIn) {
      body = <LoadingSpinner/>;
    } else if (this.state.dashboard) {
      body = <Dashboard/>;
    } else {
      body = <SigninForm onSuccessfulLogin={this.onSuccessfulLogin}/>;
    }
    return (
      <div className="App">
        {body}
      </div>
    );
  }
}

export default App;
