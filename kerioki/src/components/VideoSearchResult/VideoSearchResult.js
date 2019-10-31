import React from 'react';
import './VideoSearchResult.css';
import decodeHTMLentities from '../../utils/decodeHTMLentities';

class VideoSearchResult extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalHeight: 0,
      modalWidth: 0,
      modalClasses: 'video-search-result-hover-modal'
    }

    this.resultRef = React.createRef();
  }

  componentDidMount() {
    this.setVideoResultHoverDimensions();
    //this.resultRef.current.AddEventListener('load',this.setVideoResultHoverDimensions)
  }

  setVideoResultHoverDimensions = () => {
    this.setState({
      modalHeight: this.resultRef.current.clientHeight,
      modalWidth: this.resultRef.current.clientWidth
    })
  }

  handleHover = () => {
    if (this.state.modalClasses === 'video-search-result-hover-modal') {
      this.setState({
        modalClasses: 'video-search-result-hover-modal video-search-result-hover-modal-visible'
      })
    } else {
      this.setState({
        modalClasses: 'video-search-result-hover-modal'
      })
    }
  }

  render() {
    return (
      <div className="video-search-result-container"
      key = {this.props.video.id.videoId}
      ref={this.resultRef}
      onMouseOver={this.handleHover}
      onMouseOut={this.handleHover}>
        <div
          className={this.state.modalClasses}
          style={{ height: `${this.state.modalHeight}px`, width: `${this.state.modalWidth}px` }}
        >
          <div className="video-search-result-hover-modal-content">Queue this song!</div>
        </div>
        <div className="video-search-result-info">
          <img alt={this.props.video.snippet.title} className="video-search-result-image" src={this.props.video.snippet.thumbnails.medium.url} />
          <div className="video-search-result-content">
            <div className="video-search-result-title">{decodeHTMLentities(this.props.video.snippet.title)}</div>
            <div className="video-search-result-description">{this.props.video.snippet.description}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default VideoSearchResult;