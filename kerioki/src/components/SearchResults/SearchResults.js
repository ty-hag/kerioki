import React from 'react';
import './SearchResults.css';
import SearchResultSong from '../SearchResultSong/SearchResultSong';

class SearchResults extends React.Component {

  render() {
    const resultsToDisplay = this.props.results.map(result => {
      return <SearchResultSong songInfo={result} />
    });

    return (
      <div>{resultsToDisplay}</div>
    )
  }
}

export default SearchResults;