import React from 'react';
import VideoSearchResult from '../VideoSearchResult/VideoSearchResult';

class VideoSearch extends React.Component{

  render(){

    console.log('rendering VideoSearch, here is this.props.videos');
    console.log(this.props.videos);

    const renderedVideoList = this.props.videos.map(video => {
      return <VideoSearchResult key={video.id.videoId} video={video} getSongInfoToAddToQueue={this.props.getSongInfoToAddToQueue} />
    })

    return <div>{renderedVideoList}</div>
  }
}

export default VideoSearch;