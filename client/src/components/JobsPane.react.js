import React, { Component } from 'react';

class JobsPane extends Component {
  render() {
    return (
      <div className="JobsPane">
        <div className="JobsPane-name">
          {this.props.name}
        </div>
        <div className="JobsPane-summary">
        </div>
      </div>
    );
  }
}

export default JobsPane;
