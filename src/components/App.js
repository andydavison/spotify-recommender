import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import update from 'immutability-helper';
import axios from 'axios';

import Modeselektor from './Modeselektor';
import TopTracks from './TopTracks';
import ResultList from './ResultList';
import ValueForm from './ValueForm';
import Login from './Login';
import UserDetails from './UserDetails';

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
    this.generatePlaylist = this.generatePlaylist.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.getNewTopTrack = this.getNewTopTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  componentDidMount() {
    if (this.params.access_token && (this.params.state == null || this.params.state !== localStorage.getItem(this.stateKey))) {
      alert('There was an error during the authentication');
    } else {
      localStorage.removeItem(this.stateKey);
      if (this.params.access_token) {
        //get user info
        axios.get('https://api.spotify.com/v1/me',{headers:{'Authorization': 'Bearer ' + this.params.access_token}})
        .then(res => {
          const user = {id:res.data.id, name:res.data.display_name};
          this.setState({user:user});
        });

        //get top tracks...
        axios.get('https://api.spotify.com/v1/me/top/tracks?limit=15',{headers:{'Authorization': 'Bearer ' + this.params.access_token}})
        .then(topTracksResponse => {
          let topTrackIds = [];
          const topTracks = topTracksResponse.data.items.map(track=>{
            const imgSrc = track.album.images[track.album.images.length-2].url;
            const name = track.name;
            const artist = track.artists.map(artist => artist.name).join(', ');
            const id = track.id;
            topTrackIds.push(id);
            return {imgSrc:imgSrc, track:name, artist:artist, id:id};
          });
          this.setState({topTracks:topTracks});
          
          //...then get their audio features
          axios.get('https://api.spotify.com/v1/audio-features?ids='+topTrackIds.join(','),{headers:{'Authorization': 'Bearer ' + this.params.access_token}})
          .then(topTracksAFResponse => {
            this.setState({topTracksValues:topTracksAFResponse.data.audio_features});
          })
        });

        //IF LIVE PLAYLIST UPDATING, get pool tracks, then get audio analysis
        //update 'logged in' state
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
    const scope = 'user-read-private user-read-email user-top-read playlist-modify-public';
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
    this.setState({
      mode:mode,
      results:[],
      currentTopTrack:99
    });
  }

  generateFromValues(values) {
    const adjustedValues = {
      danceability: values.danceability/100,
      energy: values.energy/100,
      acousticness: values.acousticness/100,
      instrumentalness: values.instrumentalness/100,
      valence: values.valence/100
    };
    this.generatePlaylist(adjustedValues);
  }

  generatePlaylist(values) {
    const audioArray = this.state.audioFeatures.audio_features;

    let distanceArray = audioArray.map(track => {
      const distance = Math.sqrt(Math.pow(track.danceability - values.danceability,2)+Math.pow(track.energy - values.energy,2)+Math.pow(track.acousticness - values.acousticness,2)+Math.pow(track.instrumentalness - values.instrumentalness,2)+Math.pow(track.valence - values.valence,2));
      return {id:track.id, distance:distance};
    });
    distanceArray.sort((a,b) => a.distance - b.distance);
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

  getNewTopTrack() {
    let newTrackIndex = this.state.currentTopTrack;
    while (newTrackIndex === this.state.currentTopTrack) {
      newTrackIndex = Math.floor(Math.random()*15);
    }
    console.log("new top track index: "+newTrackIndex);
    this.setState({currentTopTrack:newTrackIndex});
    console.log("new values: "+JSON.stringify(this.state.topTracksValues[this.state.currentTopTrack]));
    this.generatePlaylist(this.state.topTracksValues[newTrackIndex]);
  }

  savePlaylist() {
    axios.post('https://api.spotify.com/v1/users/'+this.state.user.id+'/playlists',{
      name:"Andy's Spotify Recommendation"
    },{headers:{'Authorization': 'Bearer ' + this.params.access_token}})
    .then(res=>{
      let trackURIs = this.state.results.map(track=>"spotify:track:"+track.id);
      axios.post('https://api.spotify.com/v1/users/'+this.state.user.id+'/playlists/'+res.data.id+'/tracks',{
        uris:trackURIs
      },{headers:{'Authorization': 'Bearer ' + this.params.access_token}})
      .then(console.log("Playlist saved!"));
    })
  }

  render() {
    if(this.state.loggedIn===true) {
      let leftColContents = <div></div>;
      let rightColContents = <div></div>;
      if (this.state.mode==1) {
        leftColContents = <TopTracks onNewTopTrack={this.getNewTopTrack} topTrack={this.state.topTracks[this.state.currentTopTrack]}/>;
      }
      if (this.state.mode==2) {
        leftColContents = <ValueForm values={this.state.values} onValueChange={this.handleValueChange} onGenerate={()=>{this.generateFromValues(this.state.values)}}/>;
      }
      return (
        <div className="App">
          <div className="title">
            <h1><span className="purple">Andy's</span> Spotify Recommender</h1>
          </div>
          <UserDetails user={this.state.user}/>
          <div>
            <Modeselektor mode={this.state.mode} onModeChange={this.handleModeChange}/>
          </div>
          <Grid className="lower-content">
            <Row>
              <Col md={6}>
                {leftColContents}
              </Col>
              <Col md={6}>
                <ResultList results={this.state.results} onSave={this.savePlaylist}/>
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
