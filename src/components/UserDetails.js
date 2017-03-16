import React, { Component } from 'react';

class UserDetails extends Component {
  render() {
    return (
      <div className="user">
        <h1>
          Hi there <span className="purple">{this.props.user.name ? this.props.user.name : this.props.user.id}</span>
        </h1>
      </div>
    );
  }
}

export default UserDetails;