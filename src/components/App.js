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
    this.headers = {headers:{'Authorization': 'Bearer ' + this.params.access_token}};
    this.state = testState;
    this.handleValueChange = this.handleValueChange.bind(this);
    this.generateFromValues = this.generateFromValues.bind(this);
    this.generatePlaylist = this.generatePlaylist.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.getNewTopTrack = this.getNewTopTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.getSourcePlaylist = this.getSourcePlaylist.bind(this);
  }

  componentDidMount() {
    if (this.params.access_token && (this.params.state == null || this.params.state !== localStorage.getItem(this.stateKey))) {
      alert('There was an error during the authentication');
    } else {
      localStorage.removeItem(this.stateKey);
      if (this.params.access_token) {
        //get user info
        axios.get('https://api.spotify.com/v1/me',this.headers)
        .then(res => {
          const user = {id:res.data.id, name:res.data.display_name};
          this.setState({user:user});
        });

        //get top tracks...
        axios.get('https://api.spotify.com/v1/me/top/tracks?limit=30',this.headers)
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
          axios.get('https://api.spotify.com/v1/audio-features?ids='+topTrackIds.join(','),this.headers)
          .then(topTracksAFResponse => {
            this.setState({topTracksValues:topTracksAFResponse.data.audio_features});
          })
        });

        //Get source tracks and audio analysis
        let next = 'https://api.spotify.com/v1/users/ajd1989/playlists/4aHJ73VmJTeiv5byl3RSn0/tracks?fields=items(track(id,name,album(images),artists(name))),next';
        let fullSourceTracks = [];

        

        this.getSourcePlaylist(next, fullSourceTracks);

        //update 'logged in' state
        this.setState({loggedIn:true});
      } else {
        //show login, hide logged in
        this.setState({loggedIn:false});
      }
    }
  }

  getSourcePlaylist(url, fullSourceTracks) {
    axios.get(url,this.headers)
    .then(sourcePlaylistResponse => {
      //make array of track objects and array of ids from response
      let sourceTrackIds = [];
      let sourceTracks = sourcePlaylistResponse.data.items.map(item=>{
        const imgSrc = item.track.album.images[item.track.album.images.length-1].url;
        const name = item.track.name;
        const artist = item.track.artists.map(artist => artist.name).join(', ');
        const id = item.track.id;
        sourceTrackIds.push(id);
        return {imgSrc:imgSrc, track:name, artist:artist, id:id};
      });
      //get audio features for each track
      axios.get('https://api.spotify.com/v1/audio-features?ids='+sourceTrackIds.join(','),this.headers)
      .then(sourceAFResponse => {
        //add audio features to track array
        sourceTracks.forEach((track, index, arr)=>{
          arr[index].danceability = sourceAFResponse.data.audio_features[index].danceability;
          arr[index].energy = sourceAFResponse.data.audio_features[index].energy;
          arr[index].acousticness = sourceAFResponse.data.audio_features[index].acousticness;
          arr[index].instrumentalness = sourceAFResponse.data.audio_features[index].instrumentalness;
          arr[index].valence = sourceAFResponse.data.audio_features[index].valence;
        });
        //append track array to full track array
        fullSourceTracks = fullSourceTracks.concat(sourceTracks);
        //if next is not null, call again
        if(sourcePlaylistResponse.data.next) {
          this.getSourcePlaylist(sourcePlaylistResponse.data.next, fullSourceTracks);
        } else {
          this.setState({sourceTracks:fullSourceTracks});
        }
      });
    });
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
    const redirect_uri = (process.env.NODE_ENV==='development'?'http://localhost:3000':'http://andydavison.github.io/spotify-recommender'); // Your redirect uri
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

    let distanceArray = this.state.sourceTracks.map(track => {
      const distance = Math.sqrt(Math.pow(track.danceability - values.danceability,2)+Math.pow(track.energy - values.energy,2)+Math.pow(track.acousticness - values.acousticness,2)+Math.pow(track.instrumentalness - values.instrumentalness,2)+Math.pow(track.valence - values.valence,2));
      return {id:track.id, distance:distance};
    });
    distanceArray.sort((a,b) => a.distance - b.distance);

    let resultsIds = [];
    for (let i=0; i<10; i++) {
      resultsIds.push(distanceArray[i].id);
    }

    const results = resultsIds.map(resultsId=>{
      return this.state.sourceTracks.filter(sourceTrack=>sourceTrack.id===resultsId)[0];
    });
    this.setState({results:results, playlistSaved:false});
  }

  getNewTopTrack() {
    let newTrackIndex = this.state.currentTopTrack;
    while (newTrackIndex === this.state.currentTopTrack) {
      newTrackIndex = Math.floor(Math.random()*30);
    }
    this.setState({currentTopTrack:newTrackIndex});
    this.generatePlaylist(this.state.topTracksValues[newTrackIndex]);
  }

  savePlaylist(playlistName) {
    axios.post('https://api.spotify.com/v1/users/'+this.state.user.id+'/playlists',{
      name:playlistName
    },this.headers)
    .then(res=>{
      let trackURIs = this.state.results.map(track=>"spotify:track:"+track.id);
      axios.post('https://api.spotify.com/v1/users/'+this.state.user.id+'/playlists/'+res.data.id+'/tracks',{
        uris:trackURIs
      },this.headers)
      .then(this.setState({playlistSaved:true}));
    })
  }

  render() {
    if(this.state.loggedIn===true) {
      let leftColContents = <div></div>;
      let rightColContents = <div></div>;
      if (this.state.mode==1) {
        leftColContents = <TopTracks onNewTopTrack={this.getNewTopTrack} topTrack={this.state.topTracks[this.state.currentTopTrack]}/>;
        rightColContents = <ResultList results={this.state.results} onSave={this.savePlaylist} playlistSaved={this.state.playlistSaved}/>;
      }
      if (this.state.mode==2) {
        leftColContents = <ValueForm values={this.state.values} onValueChange={this.handleValueChange} onGenerate={()=>{this.generateFromValues(this.state.values)}}/>;
        rightColContents = <ResultList results={this.state.results} onSave={this.savePlaylist} playlistSaved={this.state.playlistSaved}/>;
      }
      return (
        <div className="App">
          <div className="title">
            <span className="purple">Andy's</span> Spotify Recommender
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
                {rightColContents}
              </Col>
            </Row>
          </Grid>
        </div>
      );
    } else {
      return (
        <div className="App">
          <div className="title">
            <span className="purple">Andy's</span> Spotify Recommender
          </div>
          <Login onLoginClick={this.handleLoginClick}/>
        </div>
      );
    }
  }


}

export default App;
