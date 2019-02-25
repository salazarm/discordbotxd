import './MessageContent.css';

import React, { Component } from 'react';
import AppStore from '../redux/stores/AppStore';
import setJobForm from '../redux/actions/setJobForm';

class MessageContent extends Component {
  constructor(props) {
    super(props);
    const state = AppStore.getState();
    this.state = {
      value: state.jobForm.message,
    };
  }

  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      this.setState({value: state.jobForm.message});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleChange = (event) => {
    AppStore.dispatch(setJobForm({message: event.target.value}));
  }

  render() {
    return (
      <div className="MessageContent">
        <textarea
          value={this.state.value}
          onChange={this.handleChange}>
        </textarea>
      </div>
    );
  }
}

export default MessageContent;
