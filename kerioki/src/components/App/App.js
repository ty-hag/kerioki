/*

TODO

Don't load lyrics on initial search (takes too long)
 - Remove lyrics from song search results

WIP - Styling on search panel scrollbar

Auto-size the search window (seems like I need to check the DOM for this, CSS alone is proving tricky)

Handling a lack of search results
G - No results from song search displays message
- No results for video search displays message

Ability to copy+paste lyrics


*/

import React from 'react';
import './App.css';
import geniusSearchSongs from '../../utils/geniusSearchSongs';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import CurrentSong from '../CurrentSong/CurrentSong';
import SongQueue from '../SongQueue/SongQueue';
import utaNetSearchSongs from '../../utils/utaNetSearchSongs';

require('dotenv').config();

class App extends React.Component {
  state = {
    songResults: [],
    searchStatusMessage: '',
    songQueue: [],
    currentSong: {},
    controllerConnectedIndex: -1,
    controllerCheckButtonMessage: 'Check Controller Status'
  }

  componentDidMount = () => {
    console.log('componentDidMount on App.js');
    window.addEventListener("gamepadconnected", function (e) {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    });
    console.log(navigator.getGamepads());
    this.checkForController();
  }

  onSearchSubmit = async (searchParams) => {
    // Handle initial search for songs/lyrics
    this.setState({
      searchStatusMessage: 'Searching...'
    });

    let newSongSearchResults = [];
    let updatedSearchStatusMessage = '';
    if (searchParams.language === "english") {
      newSongSearchResults = await geniusSearchSongs(searchParams.term, searchParams.resultLimit);
    } else {
      try {
        newSongSearchResults = await utaNetSearchSongs(searchParams.term, searchParams.resultLimit);
      } catch (error) {
        console.log('utanet search failed');
        updatedSearchStatusMessage = `Your search was bad`;
      }
    }

    // testing for failed search at genius
    console.log("newSongSearchResults")
    console.log(newSongSearchResults)

    this.setState({
      searchStatusMessage: updatedSearchStatusMessage,
      songResults: newSongSearchResults,
    });
  }

  handleCancelSearch = () => {
    this.setState({
      songResults: []
    })
  }

  handleSongAdd = (songToAdd, toFrontOfQueue) => {
    // handle case where there is no current song
    if (Object.entries(this.state.currentSong).length === 0 && this.state.currentSong.constructor === Object) {
      console.log('adding to current song')
      this.setState({
        currentSong: songToAdd,
        songResults: []
      })
    } else {  // handle case where there is a current song
      if (toFrontOfQueue) { // handle song being added to front of queue
        console.log('adding to front of queue');
        const updatedQueue = [songToAdd].concat(this.state.songQueue);
        this.setState({
          songQueue: updatedQueue,
          songResults: []
        });
      } else {
        console.log('adding to end of queue');
        const updatedQueue = this.state.songQueue.concat(songToAdd);
        this.setState({
          songQueue: updatedQueue,
          songResults: []
        });
      }
    }
  }

  handleControllerDisconnect = () => {
    this.setState({
      controllerConnectedIndex: -1
    })
  }

  finishCurrentSong = () => {
    if (this.state.songQueue.length === 0) {
      console.log('songQueue is 0');
      // If there are no more songs in the queue, return currentSong to default, empty-object state
      this.setState({
        currentSong: {}
      })
    } else if (this.state.songQueue.length === 1) {
      console.log('songQueue is 1');
      // If there is one song in the queue, load that song into currentSong and set queue to empty
      const newCurrentSong = this.state.songQueue[0];
      this.setState({
        currentSong: newCurrentSong,
        songQueue: []
      })
    } else {
      // If there is more than one song in the queue, load the first one and remove it from 
      console.log('songQueue is > 1');
      const newCurrentSong = this.state.songQueue[0];
      const newSongQueue = this.state.songQueue.concat([]);
      newSongQueue.shift()
      this.setState({
        currentSong: newCurrentSong,
        songQueue: newSongQueue
      })
    }
  }

  checkForController = () => {
    console.log('checking for controller');
    // Can't check for null as something that is null returns "object" on typeof
    // Does !theObjectToCheck work in its place? Looking at:
    // https://stackoverflow.com/questions/6003884/how-do-i-check-for-null-values-in-javascript
    this.setState({
      controllerCheckButtonMessage: 'Checking...'
    })
    setTimeout(() => {
      if (!navigator.getGamepads()[0] && !navigator.getGamepads()[1]) {
        console.log('gamepad null i guess');
        this.setState({
          controllerCheckButtonMessage: 'Check Controller Status'
        })
      } else {
        if (navigator.getGamepads()[0].id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)") {
          console.log('xbox controller at index 0');
          this.setState({
            controllerConnectedIndex: 0,
            controllerCheckButtonMessage: 'Check Controller Status'
          })
        } else if (navigator.getGamepads()[1].id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)") {
          console.log('xbox controller at index 1');
          this.setState({
            controllerConnectedIndex: 1,
            controllerCheckButtonMessage: 'Check Controller Status'
          })
        }
      }
    }, 1000)

  }

  render() {
    console.log('app render call');

    // Conditional render for contoller connected status
    let controllerStatus;
    if (this.state.controllerConnectedIndex === 0 || this.state.controllerConnectedIndex === 1) {
      controllerStatus = <span className='controller-found'>Connected</span>;
    } else {
      controllerStatus = <span className='controller-missing'>No Controller</span>;
    }

    return (
      <div className="App">
        <div className="title-bar">
          <div className="big-text">Kerioki</div>
          <div>
            <span className="button" id="controller-check-button" onClick={this.checkForController}>{this.state.controllerCheckButtonMessage}</span>
            {controllerStatus}
          </div>
        </div>
        <SearchBar onSubmit={this.onSearchSubmit} searchStatusMessage={this.state.searchStatusMessage} />
        <div className="main-container">
          <div>
            <SearchResults
              results={this.state.songResults}
              onVideoSearch={this.onVideoSearch}
              handleSongAdd={this.handleSongAdd}
              onCancelSearch={this.handleCancelSearch}
            />
          </div>
          <div>
            <SongQueue queuedSongs={this.state.songQueue} />
            <CurrentSong
              currentSong={this.state.currentSong}
              finishCurrentSong={this.finishCurrentSong}
              controllerConnectedIndex={this.state.controllerConnectedIndex}
              handleControllerDisconnect={this.handleControllerDisconnect}
            />
          </div>
        </div>
      </div >
    )
  }
}

export default App;