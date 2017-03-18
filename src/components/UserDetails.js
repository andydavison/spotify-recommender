import React, { Component } from 'react';

class UserDetails extends Component {
  render() {
    return (
      <div className="user">
        Hi there <span className="dark-purple">{this.props.user.name ? this.props.user.name : this.props.user.id}</span>
      </div>
    );
  }
}

export default UserDetails;