import React, { Component } from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';

class Modeselektor extends Component {
  render() {
    return (
      <div className="mode">
        <h3>
          Choose your recommendation mode
        </h3>
        <p>Generate a playlist based on a track you love, or enter seed values manually</p>
        <ButtonGroup bsSize="large">
          <Button className="btn-custom" active={this.props.mode===1} onClick={()=>this.props.onModeChange(1)}>Your Faves</Button>
          <Button className="btn-custom" active={this.props.mode===2} onClick={()=>this.props.onModeChange(2)}>Values</Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default Modeselektor;