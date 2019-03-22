import React, { Component } from 'react';
import './IncludeGroups.css';

import AppStore from '../redux/stores/AppStore';

import getChannelMemberGroups from '../redux/actions/getChannelMemberGroups';
import toggleIncludedGroup from '../redux/actions/toggleIncludedGroup';

class IncludeGroups extends Component {
  constructor() {
    super();
    const appState = AppStore.getState();
    this.state = {
      groups: appState.groups,
    };
  }

  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      this.setState({
        groups: state.jobForm.channelGroups[this.props.channel.pathname],
      });
    });
    getChannelMemberGroups(this.props.channel.pathname, AppStore);
  }

  compontWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <div>
        <label>
          Included Groups
        </label>
        {this.renderGroups()}
      </div>
    );
  }

  renderGroups() {
    if (!this.state.groups) {
      return <div className="loader"/>;
    }
    let content;
    if (this.state.groups.length) {
      content = this.state.groups.map(group =>
        <IncludeGroup name={group} />
      );
    } else {
      content = <div className="Include-groups-none">No groups to include</div>;
    }
    return (
      <div className="Include-groups">
        {content}
      </div>
    );
  }
}

class IncludeGroup extends Component {
  constructor(props) {
    super(props);
    const state = AppStore.getState();
    this.state = {
      selected: state.jobForm.includedGroups.indexOf(props.name) !== -1,
    };
  }

  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      this.setState({
        selected: state.jobForm.includedGroups.indexOf(this.props.name) !== -1,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  onClick = () => {
    AppStore.dispatch(toggleIncludedGroup({group: this.props.name}));
  }

  render() {
    let klass = "IncludedGroups-group";
    if (this.state.selected) {
      klass += " IncludedGroups-selected-group";
    }
    return (
      <div className={klass} onClick={this.onClick}>
        {this.props.name}
      </div>
    );
  }
}

export default IncludeGroups;
