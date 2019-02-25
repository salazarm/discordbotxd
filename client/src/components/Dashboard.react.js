import React, { Component } from 'react';
import './Dashboard.css';

import AppStore from '../redux/stores/AppStore';
import setDashboardPane from '../redux/actions/setDashboardPane';

import JobsPane from './JobsPane.react';
import JobPane from './JobPane.react';
import BotPane from './BotPane.react';
import CreateJobPane from './CreateJobPane.react';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    const state = AppStore.getState();
    this.state = {
      bots: state.dashboard.bots,
      user: state.user,
      pane: state.dashboard.pane,
      jobs: state.dashboard.jobs,
      id: state.dashboard.id,
      createJob: null,
    };
  }
  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      this.setState({
        bots: state.dashboard.bots,
        user: state.user,
        jobs: state.dashboard.jobs,
        pane: state.dashboard.pane,
        id: state.dashboard.id,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  setMainPaneToJobs = () => {
    AppStore.dispatch(setDashboardPane({
      pane: 'JOBS',
      id: null,
    }));
  }

  setMainPaneToJob = (jobId) => {
    AppStore.dispatch(setDashboardPane({
      pane: 'JOB',
      id: jobId,
    }));
  }

  render() {
    let pane;
    switch (this.state.pane) {
      case 'JOB':
        pane = <JobPane />;
        break;
      case 'BOT':
        let bot = this.state.bots.find(bot => bot.email === this.state.id);
        pane = <BotPane email={bot.email} />;
        break;
      case 'JOBS':
        pane = <JobsPane />;
        break;
      case 'CREATE_JOB':
        pane = <CreateJobPane />;
        break;
    }
    return (
      <div className="Dashboard">
        <div className="Dashboard-header">Carbon Fuschia</div>
        <div className="Dashboard-container">
          <div className="Dashboard-bots-pane">
            <div className="Dashboard-bot-header">
              <div className="Dashboard-bots-title">
                  Your Bots
              </div>
              <div className="Dashboard-bots-addbot">
                  Add Bot
              </div>
            </div>
            {this.state.bots.map(
              bot => (
                <Bot
                  key={bot.email}
                  id={bot.email}
                  name={bot.email}
                />
              )
            )}
          </div>
          <div className="Dashboard-main-pane">
            {pane}
          </div>
        </div>
      </div>
    );
  }
}

class Bot extends Component {
  onClick = () => {
    AppStore.dispatch(setDashboardPane({
      pane: 'BOT',
      id: this.props.id,
    }));
  }

  render() {
    return (
      <div className="Bot" onClick={this.onClick}>
        <div className="Bot-name">
          {this.props.name}
        </div>
      </div>
    );
  }
}

export default Dashboard;
