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
    videoResults: [],
    manualInputUrl: ''
  };

  // At this point, showing
  handleLyricsClick = () => {
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


  getSongInfoToAddToQueue = (youtubeUrl, id, toFrontOfQueue) => {
    const songInfoToAdd = this.props.songInfo;
    songInfoToAdd.youtubeUrl = youtubeUrl;
    songInfoToAdd.id = id;
    this.props.handleSongAdd(songInfoToAdd, toFrontOfQueue);
  }

  handleManualVideoInput = (toFrontOfQueue) => {
    // validate URL
    const youtubeRegex = /https:\/\/www\.youtube\.com\/watch\?v=[0-9A-z]{11}$/;
    const inputIsValidYoutubeUrl = youtubeRegex.test(this.state.manualInputUrl);

    if (inputIsValidYoutubeUrl) {
      const songInfoToAdd = this.props.songInfo;
      songInfoToAdd.youtubeUrl = this.state.manualInputUrl;
      songInfoToAdd.id = this.state.manualInputUrl.slice(-11);
      this.props.handleSongAdd(songInfoToAdd, toFrontOfQueue);
    } else {
      console.log('invalid youtube video URL')
    }

  }

  render() {
    // console.log('rendering SearchResultSong');

    let lyricsToRender = this.state.lyricsCollapsed === false ? this.props.songInfo.lyrics : this.props.songInfo.language === 'english' ? this.props.songInfo.lyrics.slice(0, 100) : this.props.songInfo.lyrics.slice(0, 30);

    return (
      <div className="search-result">
        <div className="search-song-title">
          {this.props.songInfo.title} - {this.props.songInfo.artist}
        </div>
        <div className="button red-button" onClick={this.handleVideoSearchClick}>
          Search for this song's videos
        </div>
        <div>
          <div className="note">Or paste youtube URL here for manual selection</div>
          <input
            className="manual-video-input"
            type="text"
            onChange={event => { this.setState({ manualInputUrl: event.target.value }) }}
          >
          </input>
          <span className='button red-button' onClick={() => { this.handleManualVideoInput(false) }}>Add</span>
        </div>
        <div className="note">Click on lyrics to show/hide full lyrics</div>
        <pre className="search-lyrics-preview" onClick={this.handleLyricsClick} >{lyricsToRender}</pre>
        <VideoSearch videos={this.state.videoResults} getSongInfoToAddToQueue={this.getSongInfoToAddToQueue} />
      </div>
    )
  }
}


export default SearchResultSong;


