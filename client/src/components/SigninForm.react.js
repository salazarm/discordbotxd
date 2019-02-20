import React, { Component } from 'react';
import './SigninForm.css';

class SigninForm extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
  }

  onSubmit = () => {
    this.setState({loggingIn: true});
    fetch('/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: this.email.current.value,
        password: this.password.current.value,
      }),
      headers:{
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
    .then((data) => {
      if (data.dashboard) {
        this.props.onSuccessfulLogin(data.dashboard);
      } else {
        this.setState({error: data.error});
      }
    })
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
