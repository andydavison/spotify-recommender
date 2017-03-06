import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';

class SeedTrack extends Component {
  render() {
    return (
      <Row >
        <Col md={5} >
          <img src={this.props.imgSrc} width={150} alt="Album art"/>
        </Col>
        <Col md={7} >
          <h3>{this.props.track}</h3>
          <p>{this.props.artist}</p>
        </Col>
      </Row>
    );
  }
}

export default SeedTrack;