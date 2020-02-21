import React from 'react';
import './currentSongLyrics.css';

class CurrentSongLyrics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      intervalId: 0,
      lyricsArrayLength: this.props.lyrics.split('\n').filter(line => { return !(line.startsWith('[') || line === ''); }).length
    }

    this.LOOP_REFRESH_RATE = 50;
    this.INPUT_CHECK_DELAY_LIMIT = (1000 / this.LOOP_REFRESH_RATE) / 2;
    this.counterForReadDelayAfterButtonPress = 0;
  }

  handleKeyPress = (event) => {
    // handles lyric scrolling with up and down arrow press on keyboard
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
    // handles lyric scrolling via gamepad
    console.log('initiating gamepad check loop')
    let checkInputInterval = setInterval(() => {

      // Handle controller disconnect
      if (!navigator.getGamepads()[this.props.controllerConnectedIndex]) {
        console.log('gamepad disconnected');
        console.log(this.state.intervalId);

        // Is it a problem to clearInterval inside of setInterval? There is no interval ID created yet?
        // This should only be reachable if there an interval ID (other than default of 0) exists,
        // So I reckon it's safe
        clearInterval(checkInputInterval);
        this.props.handleControllerDisconnect();
      } else {
        const aIsPressed = navigator.getGamepads()[this.props.controllerConnectedIndex].buttons[0].pressed;
        const bIsPressed = navigator.getGamepads()[this.props.controllerConnectedIndex].buttons[1].pressed;

        console.log(navigator.getGamepads()[this.props.controllerConnectedIndex].buttons[0].pressed)

        if (!aIsPressed && !bIsPressed || this.counterForReadDelayAfterButtonPress >= this.INPUT_CHECK_DELAY_LIMIT) {
          // reset delay after user releases button or delay timer hits its limit
          this.counterForReadDelayAfterButtonPress = 0;
        } else if (this.counterForReadDelayAfterButtonPress === 0 && aIsPressed && this.state.index < this.state.lyricsArrayLength - 1) {
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

  // WORKING ON:
  // Need to make app pick up controller input after disconnect
  // Seems comoponentDidMount is not called when you reconnect the controller after disconnect while song is loaded



  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress, false);
    clearInterval(this.state.intervalId);
  }

  render() {

    // try to run gamepad input check loop if controller is on and loop is not active (if intervalId !== 0 loop should be running)
    if (this.props.controllerConnectedIndex > -1 && this.state.intervalId === 0) {
      this.gamepadInputCheckLoop();
    }

    // get rid of empty lines or lines that start with [ (these are usually tags for chorus or something)
    const lyricsArray = this.props.lyrics.split('\n').filter(line => {
      return !(line.startsWith('[') || line === '');
    })

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