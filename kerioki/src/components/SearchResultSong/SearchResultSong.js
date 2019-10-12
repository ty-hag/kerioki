import React from 'react';
// putting CSS here didn't work, but putting it in parent element did - why?
import './SearchResultSong.css';

class SearchResultSong extends React.Component {
  state = {
    lyrics: this.props.songInfo.lyrics.slice(0, 150),
    lyricsCollapsed: true
  };

  handleLyricsClick = ()=> {
    // Should I just get rid of the boolean and check length of lyrics?
    // What if song is shorter than 150 chars?
    if (this.state.lyricsCollapsed) {
      this.setState({
        lyrics: this.props.songInfo.lyrics,
        lyricsCollapsed: false
      })
    } else {
      this.setState({
        lyrics: this.props.songInfo.lyrics.slice(0, 150),
        lyricsCollapsed: true
      })
    }
  }

  render() {
    const songInfo = this.props.songInfo;
    return (
      <div className="search-result">
        <div className="search-song-title">{songInfo.title} - {songInfo.artist}</div>
        <div className="search-lyrics-preview" onClick={this.handleLyricsClick}>{this.state.lyrics}</div>
      </div>
    )
  }
}

export default SearchResultSong;