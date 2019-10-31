import React from 'react';
// putting CSS here didn't work, but putting it in parent element did - why?
import './SearchResultSong.css';
import getLyrics from '../../utils/getLyrics';
//import getLyrics from '../../utils/utaNetSearchSongs';

class SearchResultSong extends React.Component {
  state = {
    //lyrics: this.props.songInfo.lyrics.slice(0, 150), disabling for now so I can test lyrics getting withou this
    lyrics: this.props.songInfo.lyrics,
    lyricsCollapsed: true
  };

  // handleLyricsClick = () => {
  //   // Should I just get rid of the boolean and check length of lyrics?
  //   // What if song is shorter than 150 chars?
  //   if (this.state.lyricsCollapsed) {
  //     this.setState({
  //       lyrics: this.props.songInfo.lyrics,
  //       lyricsCollapsed: false
  //     })
  //   } else {
  //     this.setState({
  //       lyrics: this.props.songInfo.lyrics.slice(0, 150),
  //       lyricsCollapsed: true
  //     })
  //   }
  // }

  handleVideoSearchClick = () => {
    const term = `${this.props.songInfo.title} ${this.props.songInfo.artist}`
    this.props.onVideoSearch(term);
  }

  handleLyricsGetClick = async () => {
    const lyricsUrl = this.props.songInfo.lyricsUrl;

    const lyrics = await getLyrics(lyricsUrl);
    this.setState({ lyrics });

  }

  render() {

    return (
      <div className="search-result">
        <div className="search-song-title">
          {this.props.songInfo.title} - {this.props.songInfo.artist}
        </div>
        <div>
          <span className="song-search-button" onClick={this.handleVideoSearchClick}>Video -></span>
          <span className="song-get-lyrics-button" onClick={this.handleLyricsGetClick}>Get lyrics</span>
        </div>
        <pre className="search-lyrics-preview" >{this.state.lyrics}</pre>
      </div>
    )
  }
}

export default SearchResultSong;