import React from 'react';
import './currentSongLyrics.css';

class CurrentSongLyrics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      intervalId: 0,
      lyricsArrayLength: this.props.lyrics.split('\n').filter(line => {return !(line.startsWith('[') || line === '');}).length
    }

    this.LOOP_REFRESH_RATE = 50;
    this.INPUT_CHECK_DELAY_LIMIT = (1000 / this.LOOP_REFRESH_RATE) / 2;
    this.counterForReadDelayAfterButtonPress = 0;
  }

  handleKeyPress = (event) => {

    // const lyricsArrayLength = this.props.lyrics.split('\n').filter(line => {
    //   return !(line.startsWith('[') || line === '');
    // }).length;

    // TODO: prevent action if keypress will go beyond range of lyrics indices
    if (event.keyCode === 40 && this.state.index < (this.state.lyricsArrayLength - 1)) {
      this.setState({
        index: this.state.index + 1
      })
    } else if (event.keyCode === 38 && this.state.index > 0) {
      this.setState({
        index: this.state.index - 1
      })
    }
  }

  gamepadInputCheckLoop = () => {
    console.log('initiating gamepad check loop')
    let checkInputInterval = setInterval(() => {

      const aIsPressed = navigator.getGamepads()[this.props.controllerConnectedIndex].buttons[0].pressed;
      const bIsPressed = navigator.getGamepads()[this.props.controllerConnectedIndex].buttons[1].pressed;

      console.log(navigator.getGamepads()[this.props.controllerConnectedIndex].buttons[0].pressed)

      if (!aIsPressed && !bIsPressed || this.counterForReadDelayAfterButtonPress >= this.INPUT_CHECK_DELAY_LIMIT) {
        // reset delay after user releases button or delay timer hits its limit
        this.counterForReadDelayAfterButtonPress = 0;
      } else if (this.counterForReadDelayAfterButtonPress === 0 && aIsPressed && this.state.index < this.state.lyricsArrayLength -1) {
        // user has pressed button and there is no active delay
        this.setState({ index: this.state.index + 1 })
        this.counterForReadDelayAfterButtonPress++;
      } else if (this.counterForReadDelayAfterButtonPress === 0 && bIsPressed && this.state.index > 0) {
        // user has pressed button and there is no active delay
        this.setState({ index: this.state.index - 1 })
        this.counterForReadDelayAfterButtonPress++;
      } else if (this.counterForReadDelayAfterButtonPress < this.INPUT_CHECK_DELAY_LIMIT && this.counterForReadDelayAfterButtonPress > 0) {
        // there is an active delay (ignore input)
        this.counterForReadDelayAfterButtonPress++;
      }


    }, this.LOOP_REFRESH_RATE)
    this.setState({ intervalId: checkInputInterval });
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress, false);
    console.log('currentSongLyrics - componentDidMount called')
    if (this.props.controllerConnectedIndex >= 0) {
      this.gamepadInputCheckLoop();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress, false);
    clearInterval(this.state.intervalId);
  }

  componentWillReceiveProps() {
    console.log('currentSongLyrics - componentWillReceiveProps called');
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