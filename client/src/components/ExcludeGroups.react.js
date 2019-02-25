import React, { Component, createRef } from 'react';
import './ExcludeGroups.css';

import AppStore from '../redux/stores/AppStore';
import MessageContent from './MessageContent.react';

import setJobForm from '../redux/actions/setJobForm';
import getChannelMemberGroups from '../redux/actions/getChannelMemberGroups';
import toggleExcludedGroup from '../redux/actions/toggleExcludedGroup';

class ExcludeGroups extends Component {
  constructor() {
    super();
    this.checkbox = createRef();
    this.state = {
      checked: AppStore.getState().jobForm.excludeGroups
    };
  }

  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      this.setState({
        checked: state.jobForm.excludeGroups,
        groups: state.jobForm.channelGroups[this.props.channel.pathname],
      });
    });
    getChannelMemberGroups(this.props.channel.pathname, AppStore);
  }

  compontWillUnmount() {
    this.unsubscribe();
  }

  onChange = () => {
    const checked = this.checkbox.current.checked;
    AppStore.dispatch(setJobForm({excludeGroups: checked}));
    getChannelMemberGroups(this.props.channel.pathname, AppStore);
  }

  render() {
    return (
      <div>
        <label>
          <input
            type="checkbox"
            onChange={this.onChange}
            checked={this.state.checked}
            ref={this.checkbox}
          />
          Exclude Groups
        </label>
        {this.renderGroups()}
      </div>
    );
  }

  renderGroups() {
    if (!this.state.checked) {
      return null;
    }
    if (!this.state.groups) {
      return <div className="loader"/>;
    }
    let content;
    if (this.state.groups.length) {
      content = this.state.groups.map(group =>
        <ExcludeGroup name={group} />
      );
    } else {
      content = <div className="Exclude-groups-none">No groups to exclude</div>;
    }
    return (
      <div className="Exclude-groups">
        {content}
      </div>
    );
  }
}

class ExcludeGroup extends Component {
  constructor(props) {
    super(props);
    const state = AppStore.getState();
    this.state = {
      selected: state.jobForm.excludedGroups.indexOf(props.name) !== -1,
    };
  }

  componentWillMount() {
    this.unsubscribe = AppStore.subscribe(() => {
      const state = AppStore.getState();
      this.setState({
        selected: state.jobForm.excludedGroups.indexOf(this.props.name) !== -1,
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  onClick = () => {
    AppStore.dispatch(toggleExcludedGroup({group: this.props.name}));
  }

  render() {
    let klass = "ExcludedGroups-group";
    if (this.state.selected) {
      klass += " ExcludedGroups-selected-group";
    }
    return (
      <div className={klass} onClick={this.onClick}>
        {this.props.name}
      </div>
    );
  }
}

export default ExcludeGroups;
