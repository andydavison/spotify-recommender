import React, { Component } from 'react';
import {Row, Col, Button} from 'react-bootstrap';

class TopTracks extends Component {

  render() {
    let seedTrackContent = <div></div>;
    if(this.props.topTrack) {
      seedTrackContent = 
        <div>
          <h3>Playlist generated from this track you love:</h3>
          <Row >
            <Col md={5} >
              <img src={this.props.topTrack.imgSrc} width={150} alt=""/>
            </Col>
            <Col md={7} >
              <h3>{this.props.topTrack.track}</h3>
              <p>{this.props.topTrack.artist}</p>
            </Col>
          </Row>
        </div>;
    } else {
      seedTrackContent = <p>Track details will be displayed here</p>
    }

    return (
      <div className="top-tracks">
        <Button className="btn-custom top-btn" onClick={this.props.onNewTopTrack}>Get A New Seed Track</Button>
        {seedTrackContent}
      </div>
    );
    
  }
}

export default TopTracks;