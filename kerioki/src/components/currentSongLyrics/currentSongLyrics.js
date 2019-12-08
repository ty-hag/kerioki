import React from 'react';
import './currentSongLyrics.css';

class CurrentSongLyrics extends React.Component {

  state = {
    index: 0
  };

  handleKeyPress = (event) => {

    const lyricsArrayLength = this.props.lyrics.split('\n').filter(line => {
      return !(line.startsWith('[') || line === '');
    }).length;

    console.log('keypress values');
    console.log(lyricsArrayLength - 1);
    console.log(this.state.index);

    // TODO: prevent action if keypress will go beyond range of lyrics indices
    if (event.keyCode === 40 && this.state.index < (lyricsArrayLength - 1)) {
      this.setState({
        index: this.state.index + 1
      })
    } else if (event.keyCode === 38 && this.state.index > 0) {
      this.setState({
        index: this.state.index - 1
      })
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }


  render() {
    const lyricsArray = this.props.lyrics.split('\n').filter(line => {
      return !(line.startsWith('[') || line === '');
    })

    console.log(lyricsArray.length - (this.state.index + 1));

    const lyricsForMapping = [];

    if (this.state.index === 0) {
      // handle first line display
      lyricsForMapping.push('(START)'); // this effectively bumps the first line into the highlight slot
      lyricsForMapping.push(lyricsArray[0]);
      lyricsForMapping.push(lyricsArray[1]);
      lyricsForMapping.push(lyricsArray[2]);
    } else if (lyricsArray.length - (this.state.index + 1) === 1) {
      // handle last 3 lines
      lyricsForMapping.push(lyricsArray[this.state.index - 1])
      lyricsForMapping.push(lyricsArray[this.state.index]);
      lyricsForMapping.push(lyricsArray[this.state.index + 1]);
      lyricsForMapping.push('...');
    } else if (lyricsArray.length - (this.state.index + 1) === 0) {
      lyricsForMapping.push(lyricsArray[this.state.index - 1])
      lyricsForMapping.push(lyricsArray[this.state.index]);
      lyricsForMapping.push('...');
      lyricsForMapping.push('(END)');
    } else {
      lyricsForMapping.push(lyricsArray[this.state.index - 1])
      lyricsForMapping.push(lyricsArray[this.state.index]);
      lyricsForMapping.push(lyricsArray[this.state.index + 1]);
      lyricsForMapping.push(lyricsArray[this.state.index + 2]);
    }

    const lyricsToRender = lyricsForMapping.map((line, index) => {
      return index === 1 ? <div className="focus-lyric">{line}</div> : <div className="display-lyric">{line}</div>;
    })


    return (
      <div>
        {lyricsToRender}
      </div >
    )
  }
}

export default CurrentSongLyrics;