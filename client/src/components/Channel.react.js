import React, { Component } from 'react';

import './Channel.css';

class Channel extends Component {
  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick({pathname: this.props.pathname});
    }
  }

  render() {
    const style = {};
    let icon;
    if (this.props.icon != '') {
      icon =(
        <div
          className="Channel-icon"
          style={{backgroundImage: this.props.icon}}
        />
      );
    } else {
      icon = (
        <div className="Channel-no-icon">
          {this.props.name.match(/\b(\w)/g).join('')}
        </div>
      );
    }
    let klass = "Channel";
    if (!this.props.onClick) {
      klass += " noClick";
    }
    return (
      <div
        className={klass}
        data-name={this.props.name}
        onClick={this.onClick}
      >
        <div className="Channel-icon-wrapper">
          {icon}
        </div>
      </div>
    );
  }
}

export default Channel;
