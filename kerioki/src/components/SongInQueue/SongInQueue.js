import React from 'react';
import './SongInQueue.css';

class SongInQueue extends React.Component {
  render() {

    return (
      <span className="queued-song">{this.props.numberInQueue}. {this.props.songInfo.title}</span>
    )
  }
}

export default SongInQueue;