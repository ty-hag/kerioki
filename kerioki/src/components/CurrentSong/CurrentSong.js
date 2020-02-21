import React from 'react';
import './CurrentSong.css';
import CurrentSongLyrics from '../currentSongLyrics/currentSongLyrics';

class CurrentSong extends React.Component {

  render() {

    const currentSong = this.props.currentSong;
    if (Object.entries(currentSong).length === 0 && currentSong.constructor === Object) {
      return <div> Please add a song! </div>
    } else {
      return (
        <div className="current-song">
          <div className="button-next-song" onClick={this.props.finishCurrentSong}>Next song</div>
          <div>
            {currentSong.title} - {currentSong.artist}
          </div>
          <div>
            <iframe src={`https://www.youtube.com/embed/${currentSong.id}`} />
          </div>
          <div>
            <CurrentSongLyrics
              key={currentSong.id}
              lyrics={this.props.currentSong.lyrics}
              controllerConnectedIndex={this.props.controllerConnectedIndex}
              handleControllerDisconnect={this.props.handleControllerDisconnect}
              />
          </div>
        </div>
      )
    }
  }
}

export default CurrentSong;