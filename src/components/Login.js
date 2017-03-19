import React, { Component } from 'react';
import {Button} from 'react-bootstrap';

class Login extends Component {
  render() {
    return (
      <div className="login">
        <h3>Login with Spotify to get started</h3>
        <Button className="btn-custom" bsSize="large" onClick={this.props.onLoginClick}>Login</Button>
      </div>
    );
  }
}

export default Login;