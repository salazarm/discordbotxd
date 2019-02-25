import React, { Component } from 'react';

import './BotPane.css';

import AppStore from '../redux/stores/AppStore';
import Channel from './Channel.react';

import startCreateJob from '../redux/actions/startCreateJob';
import refreshBotPane from '../redux/actions/refreshBotPane';

class BotPane extends Component {
  constructor(props) {
    super(props);
    const email =  props.email;
    const appState = AppStore.getState();
    const bot = appState.dashboard.bots.find(bot => bot.email === email);
    this.state = {
      channels: bot.channels,
      refreshing: appState.botpane.refreshing
    };
  }

  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      const bot = state.dashboard.bots.find(bot => bot.email === this.props.email);
      this.setState({
        channels: bot.channels,
        refreshing: state.botpane.refreshing,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  refresh = () => {
    if (!this.state.refreshing) {
      refreshBotPane(this.props.email, AppStore);
    }
  }

  onChannelClick = (channel) => {
    startCreateJob(AppStore, {pathname: channel.pathname});
  }

  render() {
    let refreshing = null;
    if (this.state.refreshing) {
      refreshing = <div className="loader"/>;
    }
    return (
      <div className="BotPane">
        <div className="BotPane-name">
          {this.props.email}
        </div>
        <div className="BotPane-select-wrapper">
          <div className="BotPane-select">Select a Channel to Message</div>
          <div className="BotPane-refresh" onClick={this.refresh}
          >Refresh {refreshing}</div>
        </div>
        <div className="BotPane-channels">
          {this.state.channels.map(channel =>
            <Channel
              key={channel.pathname}
              icon={channel.icon}
              name={channel.name}
              pathname={channel.pathname}
              onClick={this.onChannelClick}
            />
          )}
        </div>
      </div>
    );
  }
}

export default BotPane;
