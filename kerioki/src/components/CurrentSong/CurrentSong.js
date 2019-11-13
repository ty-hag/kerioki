import React from 'react';
import './CurrentSong.css';

class CurrentSong extends React.Component {

  render() {
    console.log(this.props.currentSong);
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
            <pre>
              {currentSong.lyrics}
            </pre>
          </div>
        </div>
      )
    }
  }
}

export default CurrentSong;