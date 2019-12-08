import React from 'react';
import './SearchResults.css';
import SearchResultSong from '../SearchResultSong/SearchResultSong';

class SearchResults extends React.Component {

  shouldComponentUpdate (nextProps) {
    console.log('shouldComponentUpdate called on SearchResults');
    console.log(nextProps);
    console.log(this.props);
    return nextProps != this.props;
 }

  render() {
    //this.shouldComponentUpdate()
    console.log('rendering SearchResults');
    const resultsToDisplay = this.props.results.map(result => {
      return <SearchResultSong songInfo={result} onVideoSearch={this.props.onVideoSearch} key={result.id} handleSongAdd={this.props.handleSongAdd} />
    });

    return (
      <div>
        <div id="search-results">{resultsToDisplay}</div>
      </div>
    )
  }
}

export default SearchResults;