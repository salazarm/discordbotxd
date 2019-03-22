import React, { Component } from 'react';
import './CreateJobPane.css';

import AppStore from '../redux/stores/AppStore';
import Channel from './Channel.react';
import ConfirmJob from './ConfirmJob.react';
import IncludeGroups from './IncludeGroups.react';
import MessageDelay from './MessageDelay.react';
import MessageContent from './MessageContent.react';

import setJobForm from '../redux/actions/setJobForm';

function getChannel(pathname) {
  return AppStore.getState().dashboard.bots[0].channels.find(
    channel => channel.pathname === pathname
  );
}

class CreateJobPane extends Component {
  constructor(props) {
    super(props);
    const state = AppStore.getState();
    const pathname = state.jobForm.pathname;
    const channel = getChannel(pathname);
    this.state = {
      channel: channel,
      ...state.jobForm,
    };
  }

  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      const pathname = state.jobForm.pathname;
      const channel = getChannel(pathname);
      this.setState({
        channel,
        ...state.jobForm,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  showConfirmJob() {
    AppStore.dispatch(setJobForm({
      confirming: true,
    }));
  }

  render() {
    const channel = this.state.channel;
    return (
      <div className="CreateJobPane">
        <div className="CreateJobPane-CreateJob">Message Users</div>
        <div className="CreateJobPane-Title">
          {channel.name}
        </div>
        <Channel
          name={channel.name}
          pathname={channel.pathname}
          icon={channel.icon}
        />
        <div className="CreateJobPane-options">
          <IncludeGroups channel={channel} />
          <MessageDelay channel={channel} />
        </div>
        <div className="CreateJobPane-content">
          <MessageContent />
          <div>
            <span className="CreateJobPane-no-offline">
              {'Offline users will not be messaged '}
            </span>
            <input type="Submit" onClick={this.showConfirmJob} />
          </div>
        </div>
        {this.state.confirming ? <ConfirmJob/> : null}
      </div>
    );
  }
}

export default CreateJobPane;
