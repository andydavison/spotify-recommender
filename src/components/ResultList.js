import React, { Component } from 'react';

import ResultTrack from './ResultTrack';
import SaveBtn from './SaveBtn';

class ResultList extends Component {
  render() {

    if (this.props.results.length===0) {
    	return (
        <p>Generate a playlist to see the results here</p>)
    }
    let resultListMarkup = this.props.results.map(result => <ResultTrack key={result.track} imgSrc={result.imgSrc} artist={result.artist} track={result.track}/>);
    return (
      <div>
        <SaveBtn onClick={this.props.onSave}/>
        {resultListMarkup}
      </div>
    );
  }
}

export default ResultList;