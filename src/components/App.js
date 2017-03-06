import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import update from 'immutability-helper';
import axios from 'axios';

import Modeselektor from './Modeselektor';
import SeedTrack from './SeedTrack';
import ResultList from './ResultList';
import ValueForm from './ValueForm';
import Login from './Login';

import testState from '../testState.js';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.stateKey = 'andy_spotify_auth_state';
    this.params = this.getHashParams();
    console.log("params:"+JSON.stringify(this.params));
    this.state = testState;
    this.handleValueChange = this.handleValueChange.bind(this);
    this.generateFromValues = this.generateFromValues.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
  }

  componentDidMount() {
    if (this.params.access_token && (this.params.state == null || this.params.state !== localStorage.getItem(this.stateKey))) {
      alert('There was an error during the authentication');
    } else {
      localStorage.removeItem(this.stateKey);
      if (this.params.access_token) {
        //do all the initial ajax
        //hide login, show logged in
        this.setState({loggedIn:true});
      } else {
        //show login, hide logged in
        this.setState({loggedIn:false});
      }
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  } 

  generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  handleLoginClick() {
    const client_id = '158846b449064c7c8be3d9599be748c0'; // Your client id
    const redirect_uri = 'http://localhost:3000'; // Your redirect uri
    const state = this.generateRandomString(16);
    localStorage.setItem(this.stateKey, state);
    const scope = 'user-read-private user-read-email';
    var url = 'https://accounts.spotify.com/authorize';
      url += '?response_type=token';
      url += '&client_id=' + encodeURIComponent(client_id);
      url += '&scope=' + encodeURIComponent(scope);
      url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
      url += '&state=' + encodeURIComponent(state);

      window.location = url;
  }

  handleValueChange(field, value) {
    const newState = update(this.state, {values:{[field]:{$set:value}}});
    this.setState(newState);
  }

  handleModeChange(mode) {
    this.setState({mode:mode});
  }

  generateFromValues() {
    const audioArray = this.state.audioFeatures.audio_features;
    console.log("DISTANCE FROM:"+ JSON.stringify(this.state.values));
    // for (var i = 0; i < audioArray.length; i++) {
    //   var sourceSong = audioArray[i];
    //   var distance = Math.sqrt(Math.pow(sourceSong.danceability - this.state.values.danceability/100,2)+Math.pow(sourceSong.energy - this.state.values.energy/100,2)+Math.pow(sourceSong.acousticness - this.state.values.acousticness/100,2)+Math.pow(sourceSong.instrumentalness - this.state.values.instrumentalness/100,2)+Math.pow(sourceSong.valence - this.state.values.valence/100,2));
    //   console.log("Distance ["+i+"] = "+distance);
    // }
    let distanceArray = audioArray.map(track => {
      const distance = Math.sqrt(Math.pow(track.danceability - this.state.values.danceability/100,2)+Math.pow(track.energy - this.state.values.energy/100,2)+Math.pow(track.acousticness - this.state.values.acousticness/100,2)+Math.pow(track.instrumentalness - this.state.values.instrumentalness/100,2)+Math.pow(track.valence - this.state.values.valence/100,2));
      return {id:track.id, distance:distance};
    });
    distanceArray.sort((a,b) => a.distance - b.distance);
    console.log("DISTANCE ARRAY:"+JSON.stringify(distanceArray));
    let idArray = [];
    for (let i=0; i<10; i++) {
      idArray.push(distanceArray[i].id);
    }
    const idList = idArray.join(',');
    axios.get('https://api.spotify.com/v1/tracks?ids='+idList,{headers:{'Authorization': 'Bearer ' + this.params.access_token}})
      .then(res => {
        const results = res.data.tracks.map(track => {
          const imgSrc = track.album.images[track.album.images.length-1].url;
          const name = track.name;
          const artist = track.artists.map(artist => artist.name).join(', ');
          const id = track.id;
          return {imgSrc:imgSrc, track:name, artist:artist, id:id};
        });
        this.setState({results:results});
      });
  }

  render() {
    if(this.state.loggedIn===true) {
      return (
        <div className="App">
          <div className="title">
            <h1><span className="purple">Andy's</span> Spotify Recommender</h1>
          </div>
          <div>
            <Modeselektor mode={this.state.mode} onModeChange={this.handleModeChange}/>
          </div>
          <Grid className="lower-content">
            <Row>
              <Col md={6}>
                <ValueForm values={this.state.values} onValueChange={this.handleValueChange} onGenerate={this.generateFromValues}/>
                <SeedTrack track="Somebody Told Me" artist="The Killers" imgSrc="https://i.scdn.co/image/d0186ad64df7d6fc5f65c20c7d16f4279ffeb815"/>
              </Col>
              <Col md={6}>
                <ResultList results={this.state.results}/>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    } else {
      return (
        <div className="App">
          <div className="title">
            <h1><span className="purple">Andy's</span> Spotify Recommender</h1>
          </div>
          <Login onLoginClick={this.handleLoginClick}/>
        </div>
      );
    }
  }


}

export default App;
