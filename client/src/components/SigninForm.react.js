import React, { Component } from 'react';
import './SigninForm.css';

class SigninForm extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
  }

  componentDidMount() {
    this.onSubmit();
  }

  onSubmit = () => {
    this.props.login(this.email.current.value, this.password.current.value);
  }

  render() {
    return (
      <div className="SigninForm">
        <div>
          <label>Email
            <input placeholder="email" ref={this.email}/>
          </label>
        </div>
        <div>
          <label>
            Password
            <input placeholder="password" ref={this.password}/>
          </label>
        </div>
        <input type="submit" onClick={this.onSubmit}/>
      </div>
    );
  }
}

export default SigninForm;
