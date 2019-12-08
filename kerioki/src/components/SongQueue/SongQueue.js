import React from 'react';
import SongInQueue from '../SongInQueue/SongInQueue';

class SongQueue extends React.Component {
  render() {

    const songsToRender = this.props.queuedSongs.map((song, index) => {
      return <SongInQueue songInfo={song} key={song.id} numberInQueue={index + 1} />
    })

    return (
      <div>
        <div>Song Queue:</div>
        <div>{songsToRender}</div>
      </div>
      
    )
  }
}

export default SongQueue;