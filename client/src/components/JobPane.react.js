import React, { Component } from 'react';

class JobPane extends Component {
  render() {
    return (
      <div className="JobPane">
        <div className="JobPane-name">
          {this.props.name}
        </div>
        <div className="JobPane-summary">
        </div>
      </div>
    );
  }
}

export default JobPane;
