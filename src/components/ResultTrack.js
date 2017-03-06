import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';

class ResultTrack extends Component {
  render() {
    return (
      <Row className="result-track">
        <Col md={5} >
          <img src={this.props.imgSrc} width={64} alt="Album art"/>
        </Col>
        <Col md={7} className="result-track-text">
          <p>{this.props.track} by {this.props.artist}</p>
        </Col>
      </Row>
    );
  }
}

export default ResultTrack;