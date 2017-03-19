import React, { Component } from 'react';

class UserDetails extends Component {
  render() {
    return (
      <div className="user">
        <h2>Hi there <span className="dark-purple">{this.props.user.name ? this.props.user.name : this.props.user.id}</span></h2>
      </div>
    );
  }
}

export default UserDetails;