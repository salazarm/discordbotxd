import './Modal.css';
import React, { Component } from 'react';

class Modal extends Component {
  render() {
    return (
      <div className="Modal">
        <div
          className="Modal-wrapper"
          style={{
            height: this.props.height,
            width: this.props.width
          }}>
          <div className={"Modal-content "+ this.props.className}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
