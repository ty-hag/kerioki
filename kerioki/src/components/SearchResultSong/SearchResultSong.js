import React from 'react';
// putting CSS here didn't work, but putting it in parent element did - why?
import './SearchResultSong.css';
import VideoSearch from '../VideoSearch/VideoSearch';
import youtube from '../../utils/youtube';
//import getLyrics from '../../utils/utaNetSearchSongs';

class SearchResultSong extends React.Component {

  state = {
    lyrics: this.props.songInfo.language === 'english' ? this.props.songInfo.lyrics.slice(0, 100) : this.props.songInfo.lyrics.slice(0, 30),
    lyricsCollapsed: true,
    videoResults: []
  };

  // At this point, showing
  handleLyricsClick = () => {
    console.log('handle lyrics click')
    // This toggles between a preview version of the lyrics and the full lyrics
    if (this.state.lyricsCollapsed) {
      this.setState({
        lyricsCollapsed: false
      })
    } else {
      this.setState({
        lyricsCollapsed: true
      })
    }
  }

  handleVideoSearchClick = async () => {
    const searchTerm = `${this.props.songInfo.title} ${this.props.songInfo.artist}`

    const response = await youtube.get('/search', {
      params: {
        q: searchTerm
      }
    })

    this.setState({
      videoResults: response.data.items
    })
  }


  getSongInfoToAddToQueue = (youtubeUrl, toFrontOfQueue) => {
    const songInfoToAdd = this.props.songInfo;
    songInfoToAdd.youtubeUrl = youtubeUrl;
    this.props.handleSongAdd(songInfoToAdd, toFrontOfQueue);
  }

  render() {
    console.log('SearchResultSong render called');

    let lyricsToRender = this.state.lyricsCollapsed === false ? this.props.songInfo.lyrics : this.props.songInfo.language === 'english' ? this.props.songInfo.lyrics.slice(0, 100) : this.props.songInfo.lyrics.slice(0, 30);

    return (
      <div className="search-result">
        <div className="search-song-title">
          {this.props.songInfo.title} - {this.props.songInfo.artist}
        </div>
        <div>
          <span className="video-search-button" onClick={this.handleVideoSearchClick}>Search for this song's videos</span>
        </div>
        <div className="note">Click on lyrics to show/hide full lyrics</div>
        <pre className="search-lyrics-preview" onClick={this.handleLyricsClick} >{lyricsToRender}</pre>
        <VideoSearch videos={this.state.videoResults} getSongInfoToAddToQueue={this.getSongInfoToAddToQueue} />
      </div>
    )
  }
}


export default SearchResultSong;