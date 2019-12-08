import React from 'react';
// putting CSS here didn't work, but putting it in parent element did - why?
import './SearchResultSong.css';
import VideoSearch from '../VideoSearch/VideoSearch';
import youtube from '../../utils/youtube';
//import getLyrics from '../../utils/utaNetSearchSongs';

const fakeVideoResultForTesting = {
  id: {
    videoId: 'w4toh34toih'
  },
  snippet: {
    title: "Title",
    thumbnails: {
      medium: {
        url: "https://vignette.wikia.nocookie.net/pokemon/images/3/31/050Diglett.png"
      }
    },
    description: "Cool video!"
  }
}

class SearchResultSong extends React.Component {

  state = {
    lyrics: this.props.songInfo.language === 'english' ? this.props.songInfo.lyrics.slice(0, 100) : this.props.songInfo.lyrics.slice(0, 30),
    lyricsCollapsed: true,
    videoResults: []
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

  render() {
    // console.log('rendering SearchResultSong');

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


