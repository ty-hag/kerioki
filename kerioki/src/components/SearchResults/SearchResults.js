import React from 'react';
import './SearchResults.css';
import SearchResultSong from '../SearchResultSong/SearchResultSong';

class SearchResults extends React.Component {

  render() {
    //this.shouldComponentUpdate()
    console.log('rendering SearchResults');
    const resultsToDisplay = this.props.results.map(result => {
      return <SearchResultSong songInfo={result} onVideoSearch={this.props.onVideoSearch} key={result.id} handleSongAdd={this.props.handleSongAdd} />
    });

    const cancelButton = this.props.results.length > 0 ? <span className="button" onClick={this.props.onCancelSearch}>Clear Search Results</span> : '';

    return (
      <div>
        <div>{cancelButton}</div>
        <div id="search-results">{resultsToDisplay}</div>
      </div>
    )
  }
}

export default SearchResults;