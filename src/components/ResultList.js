import React, { Component } from 'react';

import ResultTrack from './ResultTrack';
import SaveBtn from './SaveBtn';

class ResultList extends Component {
  render() {

    let resultListMarkup = this.props.results.map(result => <ResultTrack key={result.track} imgSrc={result.imgSrc} artist={result.artist} track={result.track}/>);

    return (
      <div>
        <SaveBtn/>
        {resultListMarkup}
      </div>
    );
  }
}

export default ResultList;