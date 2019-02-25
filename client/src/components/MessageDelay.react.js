import './MessageDelay.css';

import React, { Component } from 'react';
import AppStore from '../redux/stores/AppStore';

import setJobForm from '../redux/actions/setJobForm';

class MessageDelay extends Component {
  constructor(props) {
    super(props);
    const state = AppStore.getState();
    this.state = {
      value: state.jobForm.messageDelay,
    };
  }

  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      this.setState({value: state.jobForm.messageDelay});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange = (event) => {
    AppStore.dispatch(setJobForm({
      messageDelay: parseInt(event.target.value),
    }));
  }

  render() {
    return (
      <div>
        <label>
          {'Message Delay '}
          <select
            value={this.state.value}
            onChange={this.onChange}
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
          </select>
          {' Seconds'}
        </label>
      </div>
    );
  }
}

export default MessageDelay;
