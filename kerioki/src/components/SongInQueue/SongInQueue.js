import React from 'react';

class SongInQueue extends React.Component {
  render() {

    return (
      <div>{this.props.numberInQueue}. {this.props.songInfo.title}</div>
    )
  }
}

export default SongInQueue;