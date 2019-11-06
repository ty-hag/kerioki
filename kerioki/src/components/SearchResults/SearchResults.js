import React from 'react';
import './SearchResults.css';
import SearchResultSong from '../SearchResultSong/SearchResultSong';

class SearchResults extends React.Component {

  render() {
    const resultsToDisplay = this.props.results.map(result => {
      return <SearchResultSong songInfo={result} onVideoSearch={this.props.onVideoSearch} key={result.id} handleSongAdd={this.props.handleSongAdd} />
    });

    return (
      <div id="search-results">{resultsToDisplay}</div>
    )
  }
}

export default SearchResults;