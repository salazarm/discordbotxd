import './ConfirmJob.css';
import React, { Component } from 'react';
import AppStore from '../redux/stores/AppStore';
import Channel from './Channel.react';
import Modal from './Modal.react';

import submitJob from '../redux/actions/submitJob';

function getChannel(pathname) {
  return AppStore.getState().dashboard.bots[0].channels.find(
    channel => channel.pathname === pathname
  );
}

class ConfirmJob extends Component {
  constructor(props) {
    super(props);
    const state = AppStore.getState();
    const pathname = state.jobForm.pathname;
    const channel = getChannel(pathname);
    this.state = {
      channel: channel,
      jobForm: state.jobForm,
    };
  }

  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      const channel = getChannel(state.jobForm.pathname);
      this.setState({
        channel,
        jobForm: state.jobForm,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  confirm = () => {
    submitJob(
      this.state.jobForm,
      AppStore,
    );
  }

  render() {
    const {channel, jobForm} = this.state;
    return (
      <Modal width={400} height={400} className="ConfirmJob">
        <div className="ConfirmJob-messaging">
          <div>Messaging {channel.name}</div>
          <Channel
            name={channel.name}
            pathname={channel.pathname}
            icon={channel.icon}
          />
        </div>
        {this.renderExecludedGroups()}
        <pre className="ConfirmJob-message">
          {jobForm.message}
        </pre>
        <div className="ConfirmJob-delay">
          Your message delay is {jobForm.messageDelay} seconds.
        </div>
        <input type="submit" value="Confirm" onClick={this.confirm}/>
      </Modal>
    );
  }

  renderExecludedGroups() {
    const jobForm = this.state.jobForm;
    if (!jobForm.excludedGroups.length) {
      return (
        <div className="ConfirmJob-excluding">
          No member groups to exclude
        </div>
      )
    }
    if (jobForm.excludeGroups) {
      return (
        <div className="ConfirmJob-excluding">
          Excluding the following member groups:
          <ul>
            {this.state.jobForm.excludedGroups.map(
              group => <li>{group}</li>
            )}
          </ul>
        </div>
      );
    }
    const groups = jobForm.channelGroups[jobForm.pathname];
    return (
      <div className="ConfirmJob-excluding">
        Warning, not excluding the follow groups:
        <ul>
          {groups.map(
            group => <li>{group}</li>
          )}
        </ul>
      </div>
    )
  }
}

export default ConfirmJob;
