import React, { Component } from 'react';
import {Row, Col, Button} from 'react-bootstrap';

class TopTracks extends Component {

  render() {
    let seedTrackContent = <div></div>;
    if(this.props.topTrack) {
      seedTrackContent = 
        <div>
          <Row >
            <Col xs={5} >
              <img src={this.props.topTrack.imgSrc} width={150} alt=""/>
            </Col>
            <Col xs={7} className='top-track-text'>
              <div>
                <p>{this.props.topTrack.track}</p>
                <p>{this.props.topTrack.artist}</p>
              </div>
            </Col>
          </Row>
        </div>;
    } else {
      seedTrackContent = <div></div>;
    }

    return (
      <div className="top-tracks">
        <h4>Get Recommendations Based On A Favourite Track</h4>
        <Button className="btn-custom top-btn" onClick={this.props.onNewTopTrack}>Generate A New Playlist</Button>
        {seedTrackContent}
      </div>
    );
    
  }
}

export default TopTracks;