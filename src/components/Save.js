import React, { Component } from 'react';
import {Button, FormGroup, FormControl} from 'react-bootstrap';

class Save extends Component {
  
  constructor(props) {
    super(props);
    this.state = {playlistName:''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange(e) {
    this.setState({playlistName:e.target.value});
  }

  handleSave() {
    this.props.onSave(this.state.playlistName);
    this.setState({playlistName:''});
  }

  render() {
    if (this.props.playlistSaved) {
      return (
        <div className='saveSection'>
          <h4>Playlist Saved!</h4>
        </div>
      );
    } else {
      return (
        <div className='saveSection'>
          <form>
            <FormGroup>
              <FormControl
                type="text"
                value={this.state.playlistName}
                placeholder="Playlist Name"
                onChange={this.handleChange}
                className="input-custom"
              />
            </FormGroup>
            <Button className="btn-custom top-btn" onClick={this.handleSave}>Save Playlist</Button>
          </form>
        </div>
      );
    }
  }
}

export default Save;