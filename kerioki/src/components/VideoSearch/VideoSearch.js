import React from 'react';
import VideoSearchResult from '../VideoSearchResult/VideoSearchResult';

class VideoSearch extends React.Component{

  render(){

    const renderedVideoList = this.props.videos.map(video => {
      return <VideoSearchResult key={video.id.videoId} video={video} />
    })

    return <div>{renderedVideoList}</div>
  }
}

export default VideoSearch;