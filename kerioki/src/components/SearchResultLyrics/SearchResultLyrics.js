import React from 'react';

class SearchResultLyrics extends React.Component {
  render(){
    return (
      <div>
        {this.props.lyrics}
      </div>
    )
  }
}

export default SearchResultLyrics;