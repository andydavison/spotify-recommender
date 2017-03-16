import React, { Component } from 'react';
import {Button} from 'react-bootstrap';

class SaveBtn extends Component {
  render() {
    return (
      <Button className="btn-custom top-btn" onClick={this.props.onClick}>Save Playlist</Button>
    );
  }
}

export default SaveBtn;