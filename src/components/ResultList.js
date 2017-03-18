import React, { Component } from 'react';

import ResultTrack from './ResultTrack';
import Save from './Save';

class ResultList extends Component {
  render() {

    if (this.props.results.length===0) {
    	return (
        <p>Generate a playlist to see the results here</p>)
    }
    let resultListMarkup = this.props.results.map(result => <ResultTrack key={result.id} imgSrc={result.imgSrc} artist={result.artist} track={result.track}/>);
    return (
      <div>
        <Save onSave={this.props.onSave} playlistSaved={this.props.playlistSaved}/>
        {resultListMarkup}
      </div>
    );
  }
}

export default ResultList;